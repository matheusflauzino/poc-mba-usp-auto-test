import { Config } from '@infra';
import { Account } from '@entities';
import { IAccountMapper } from '@adapters';
import { DynamoDB, GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { MainModels } from '../models';
import { Logger } from 'pino';

export default class DynamoAccountMapper implements IAccountMapper {
  private dynamoDB: DynamoDB;
  private config: Config;
  private logger: Logger;

  constructor(params: any) {
    this.dynamoDB = params.dynamoDB;
    this.config = params.config;
    this.logger = params.logger;
  }

  public async find(identifier: string): Promise<Account | undefined> {
    const query: GetItemInput = {
      TableName: this.config.databases.dynamoDB.account.name,
      Key: {
        identifier: {
          S: identifier
        }
      }
    };

    const response = await this.dynamoDB.getItem(query);

    if (!response.Item) {
      return;
    }

    const model = MainModels.AccountModel.createFromAttributeMap(response.Item);
    const entity = model.toEntity();

    this.logger.info('Account hit', { account: entity });

    return entity;
  }

  public async save(account: Account): Promise<void> {
    const model = MainModels.AccountModel.createFromEntity(account);

    const putItemOptions: PutItemInput = {
      TableName: this.config.databases.dynamoDB.account.name,
      Item: model.toAttributeMap()
    };

    await this.dynamoDB.putItem(putItemOptions);

    this.logger.info('Account saved');
  }
}
