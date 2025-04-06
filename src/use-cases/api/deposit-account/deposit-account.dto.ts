import { OutputPort } from '@useCases';
import { DepositAccountGateway } from './deposit-account.gateway';
import { Account } from '@entities';

export interface DepositAccountInjections {
  depositAccountGateway: DepositAccountGateway;
  depositAccountPresenter: OutputPort<DepositAccountOutput>;
}

export type DepositAccountInput = {
  identifier: string;
  amount: number;
};

export type DepositAccountData = {
  account: Account;
};

export type DepositAccountOutput = {
  success: boolean;
  data?: DepositAccountData;
  failure?: {
    data: any;
  };
};
