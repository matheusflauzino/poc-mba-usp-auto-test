import { SSM } from '@aws-sdk/client-ssm';
import { Constants } from '../../shared';
import { existsSync, readFileSync } from 'fs';
import https from 'https';

const env = process.env.NODE_ENV || Constants.Env.Development;

export type Config = {
  readonly env: string;
  readonly projectData: {
    readonly name: string;
    readonly version: string;
  };
  readonly log: {
    readonly level: any;
    readonly stream: string;
  };
  readonly httpServer: {
    readonly port: number;
  };
  readonly timezone: string;
  readonly databases: {
    readonly dynamoDB: any;
  };
  readonly queues: {
    readonly self: string;
  };
  readonly aws: {
    readonly sqs: {
      readonly endpoint: string;
    };
    readonly dynamodb: {
      readonly endpoint: string;
    };
  };
}

let config: Config;

if (!process.env.NODE_EXTRA_CA_CERTS) {
  process.env.NODE_EXTRA_CA_CERTS = '/etc/ssl/certs/ca-certificates.crt';
}

if (existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
  https.globalAgent.options.ca = readFileSync(process.env.NODE_EXTRA_CA_CERTS);
}

const appPackage = JSON.parse(readFileSync('package.json').toString('utf-8'));

const buildParamName = (param: string): string => {
  return `/${env}/${appPackage.name}/${param}`;
};

const buildCertificatePath = (param: 'pub' | 'priv') => {
  return `/${env}/${appPackage.name}/certificates/${param}`;
};



const PARAMETER_CONFIG = buildParamName('config');
const PARAMETER_DATABASES = buildParamName('databases');
const PARAMETER_TIMEZONE = `/${env}/common/timezone`;

const getParameters = async (): Promise<{ [key: string]: string }> => {
  if (env === Constants.Env.Development) {
    return {
      [PARAMETER_CONFIG]: readFileSync(`${__dirname}/config.json`).toString(),
      [PARAMETER_DATABASES]: readFileSync(`${__dirname}/databases.json`).toString(),
      [PARAMETER_TIMEZONE]: 'America/Fortaleza'
    };
  }

  const ssm = new SSM({ apiVersion: '2014-11-06' });

  const options = {
    Names: [PARAMETER_CONFIG, PARAMETER_DATABASES, PARAMETER_TIMEZONE],
    WithDecryption: true
  };

  const response = await ssm.getParameters(options);

  if (!response?.Parameters) {
    throw new Error('Cannot get parameters from SSM');
  }

  const params: { [key: string]: string } = {};

  response.Parameters.forEach((p) => {
    if (p.Name && p.Value) {
      params[p.Name] = p.Value;
    }
  });

  return params;
};

export const initConfig = async () => {
  if (config) return;

  const params = await getParameters();

  const configParameter = JSON.parse(params[PARAMETER_CONFIG]);
  const databasesParameter = JSON.parse(params[PARAMETER_DATABASES]);

  configParameter.timezone = params[PARAMETER_TIMEZONE];
  configParameter.databases = databasesParameter;
  configParameter.env = env;
  configParameter.projectData = {};
  configParameter.projectData.name = appPackage.name;
  configParameter.projectData.version = appPackage.version;

  config = configParameter;
};

export const getConfig = () => {
  return config;
};
