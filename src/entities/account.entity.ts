import { Entity, Result } from '@entities';
import { Constants, Errors, Utils } from '@shared';

export interface AccountProps {
  identifier?: string;
  name: string;
  email: string;
  document: string;
  balance: number;
}

export class Account extends Entity<AccountProps> {
  private constructor(props: AccountProps) {
    super(props);
  }

  public static build(props: AccountProps): Result<Account> {
    const errors: Array<Error> = [];

    if (!props.name) {
      errors.push(new Errors.UnprocessableEntityError('Missing property name'));
    }

    if (!props.email) {
      errors.push(new Errors.UnprocessableEntityError('Missing property email'));
    }

    if (!props.document) {
      errors.push(new Errors.UnprocessableEntityError('Missing property document'));
    }

    if (props.balance === undefined || props.balance === null) {
      errors.push(new Errors.UnprocessableEntityError('Missing property balance'));
    }

    if (errors.length > 0) {
      return Result.fail<Account>(errors);
    }

    if (!props.identifier) {
      props.identifier = Utils.generateUUID();
    }

    return Result.success<Account>(new Account(props));
  }

  get identifier() {
    return this.props.identifier;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get document() {
    return this.props.document;
  }

  get balance() {
    return this.props.balance;
  }

  getProps(): AccountProps {
    return this.props;
  }
}
