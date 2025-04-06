import { Account } from '@entities';
import { GConstructor, IAccountMapper } from '../dtos';

export function MixAccountRepository<TBase extends GConstructor>(Base: TBase) {
  return class AccountRepository extends Base {
    public _accountMapper: IAccountMapper;

    constructor(...args: any[]) {
      super(...args);
      this._accountMapper = args[0].accountMapper;
    }

    async saveAccount(data: Account): Promise<void> {
      await this._accountMapper.save(data);
    }

    async findAccount(identifier: string): Promise<Account | undefined> {
      return this._accountMapper.find(identifier);
    }
  };
}
