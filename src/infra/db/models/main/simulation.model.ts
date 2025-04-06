import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Simulation } from '@entities';

type AttributeMap = Record<string, AttributeValue>;

export class SimulationModel {
  public identifier: string;
  public data: string;
  public principal: number;
  public annualInterestRate: number;
  public months: number;
  public ttl?: number;

  public static createFromAttributeMap(map: AttributeMap) {
    const model = new this();
    model.identifier = map.identifier.S as string;
    model.data = map.data.S as string;
    model.ttl = Number(map.ttl?.N);

    return model;
  }

  public static createFromEntity(entity: Simulation): SimulationModel {
    const model = new this();
    model.ttl = entity.ttl;

    return model;
  }

  public toAttributeMap(): AttributeMap {
    return {
      identifier: {
        S: `${this.identifier}`
      },
      data: {
        S: `${this.data}`
      },
      ttl: {
        N: `${this.ttl}`
      },
      principal: {
        N: `${this.ttl}`
      }
    };
  }

  public toEntity(): Simulation {
    return Simulation.build({
      identifier: this.identifier,
      ttl: this.ttl,
      principal: this.principal,
      annualInterestRate: this.annualInterestRate,
      months: this.months
    }).value;
  }
}
