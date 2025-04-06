import { SQS } from '@aws-sdk/client-sqs';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('src/infra/config/config.json').toString());

const sqs = new SQS(config.aws.sqs);

const getMessageBody = (messageName) => {
  switch (messageName) {

    case 'process_simulation':
      return {
        simulations: [
          {
            principal: 1000.00,
            birthDate: "1950-02-22",
            months: 12
          }
        ]
      };
    default:
      return;
  }
};

const getMessage = ({ messageType = 'advance_request_response' }) => {
  return {
    type: messageType,
    ...getMessageBody(messageType)
  };
};

const send = async (sendTo, message) => {
  await sqs.sendMessage({
    DelaySeconds: 0,
    MessageBody: JSON.stringify(message),
    ...(message.type === 'NewTransferToAccount' && {
      MessageAttributes: { messageType: { DataType: 'String', StringValue: message.type } }
    }),
    QueueUrl: "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/dev_simulation"
  });
};

const sendMessage = async (messageType) => {
  console.log('Configs loaded');
  try {
    const sendTo = 'dev'; //dev ou testing

    const message = getMessage({ messageType });
    console.log('Sending SQS message...');

    await send(sendTo, message);

    console.log('Message sent: ', JSON.stringify(message));
  } catch (err) {
    console.log(err);
  }
};

sendMessage(process.argv[2]);
