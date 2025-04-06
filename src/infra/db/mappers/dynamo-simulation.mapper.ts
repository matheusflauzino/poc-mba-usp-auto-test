import { Config } from '@infra';
import { Simulation } from '@entities';
import { ISimulationMapper } from '@adapters';
import { DynamoDB, GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { MainModels } from '../models';
import { Logger } from 'pino';
import { Utils, Constants } from '@shared';

export default class DynamoSimulationMapper implements ISimulationMapper {
  private dynamoDB: DynamoDB;
  private config: Config;
  private logger: Logger;

  constructor(params: any) {
    this.dynamoDB = params.dynamoDB;
    this.config = params.config;
    this.logger = params.logger;
  }

  public async find(identifier: string): Promise<Simulation | undefined> {
    const query: GetItemInput = {
      TableName: this.config.databases.dynamoDB.simulation.name,
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

    const model = MainModels.SimulationModel.createFromAttributeMap(response.Item);
    const entity = model.toEntity();

    this.logger.info('Simulation hit', { simulation: entity });

    if (entity.ttl && entity.ttl < Utils.getCurrentTime() + Constants.Time.TenSeconds) {
      this.logger.info('Simulation expired', {
        simulation: entity
      });
      return;
    }

    return entity;
  }

  public async save(simulation: Simulation): Promise<void> {
    const model = MainModels.SimulationModel.createFromEntity(simulation);

    const putItemOptions: PutItemInput = {
      TableName: this.config.databases.dynamoDB.simulation.name,
      Item: model.toAttributeMap()
    };

    await this.dynamoDB.putItem(putItemOptions);

    this.logger.info('Simulation saved');
  }
}
