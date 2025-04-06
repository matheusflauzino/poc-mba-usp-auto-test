import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Account } from '@entities';

type AttributeMap = Record<string, AttributeValue>;

export class AccountModel {
  public identifier: string;
  public name: string;
  public email: string;
  public document: string;
  public balance: number;

  public static createFromAttributeMap(map: AttributeMap) {
    const model = new this();
    model.identifier = map.identifier.S as string;
    model.name = map.name.S as string;
    model.email = map.email.S as string;
    model.document = map.document.S as string;
    model.balance = Number(map.balance.N);

    return model;
  }

  public static createFromEntity(entity: Account): AccountModel {
    const model = new this();
    model.identifier = entity.identifier!;
    model.name = entity.name;
    model.email = entity.email;
    model.document = entity.document;
    model.balance = entity.balance;

    return model;
  }

  public toAttributeMap(): AttributeMap {
    return {
      identifier: {
        S: this.identifier
      },
      name: {
        S: this.name
      },
      email: {
        S: this.email
      },
      document: {
        S: this.document
      },
      balance: {
        N: this.balance.toString()
      }
    };
  }

  public toEntity(): Account {
    return Account.build({
      identifier: this.identifier,
      name: this.name,
      email: this.email,
      document: this.document,
      balance: this.balance
    }).value;
  }
}
