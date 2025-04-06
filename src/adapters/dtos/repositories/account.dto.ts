import { Account } from '@entities';

export interface IAccountMapper {
  find(identifier: string): Promise<Account | undefined>;
  save(account: Account): Promise<void>;
}
