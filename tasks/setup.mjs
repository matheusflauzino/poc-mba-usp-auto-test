/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import sqs from '@aws-sdk/client-sqs';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const copyConfigs = () => {
  console.log('\x1b[33m%s\x1b[0m', 'Copying json config...');

  const databaseContent = readFileSync('src/infra/config/git-ignored/databases.json', 'utf8');
  writeFileSync('src/infra/config/databases.json', databaseContent);

  const configContent = readFileSync('src/infra/config/git-ignored/config.json', 'utf8').replace(
    /\{\{DEVELOPER_REGISTRATION\}\}/gm,
    process.env.DEVELOPER_REGISTRATION
  );
  writeFileSync('src/infra/config/config.json', configContent);

  console.log('\x1b[33m%s\x1b[0m', 'Copying tests config file...');
  const testsConfig = readFileSync('tests/api/.env.template', 'utf8');

  writeFileSync(
    'tests/api/.env',
    testsConfig.replace(/\{\{DEVELOPER_REGISTRATION\}\}/gm, process.env.DEVELOPER_REGISTRATION)
  );
};

const compile = () => {
  console.log('\x1b[33m%s\x1b[0m', 'Compiling...');
  execSync('rm -rf dist/');
  execSync('tsc');
};


const getConfig = () => {
  const config = JSON.parse(readFileSync('src/infra/config/config.json').toString());
  config.databases = JSON.parse(readFileSync('src/infra/config/databases.json').toString());
  return config;
};

const createQueues = async () => {
  console.log('\x1b[33m%s\x1b[0m', 'Creating queues...');

  const createQueue = async (queueConfig) => {
    const result = await sqsClient.send(new sqs.CreateQueueCommand(queueConfig));
    console.log(`Created queue ${result.QueueUrl}`);
  };

  const queueNames = ['dev_simulation'];

  for (const queueName of queueNames) {
    await createQueue({ QueueName: queueName });
  }
};



const createDynamoDBTables = async () => {
  console.log('\x1b[36m%s\x1b[0m', 'Creating DynamoDB tables...');
  const config = getConfig();
  const dynamoDB = new DynamoDB(config.aws.dynamodb);

  const { dropTables, ...tables } = config.databases.dynamoDB;
  if (dropTables) {
    for (const table of Object.values(tables)) {
      try {
        await dynamoDB.deleteTable({ TableName: table.name });
        console.info(`Table ${table.name} deleted...`);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  const createTable = async (tableConfig) => {
    try {
      await dynamoDB.createTable(tableConfig);
    } catch (err) {
      const ignoredErrors = ['Table already created', 'Cannot create preexisting table'];

      if (!ignoredErrors.includes(err.message)) {
        throw err;
      }
    }
  };

  await createTable({
    TableName: config.databases.dynamoDB.simulation.name,
    AttributeDefinitions: [
      {
        AttributeName: 'identifier',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'identifier',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TimeToLiveSpecification: {
      AttributeName: 'ttl',
      Enabled: true
    }
  });

};

let config;
let sqsClient;
(async () => {
  try {
    copyConfigs();
    config = getConfig();

    sqsClient = new sqs.SQS(config.aws.sqs);

    compile();
    await createDynamoDBTables();
    await createQueues();
    console.log('\x1b[5m%s\x1b[0m', 'Setup completed');
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'Project setup error');
    console.log(err);
  }
})();
