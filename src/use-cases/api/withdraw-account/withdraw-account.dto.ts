import { OutputPort } from '@useCases';
import { WithdrawAccountGateway } from './withdraw-account.gateway';
import { Account } from '@entities';

export interface WithdrawAccountInjections {
  withdrawAccountGateway: WithdrawAccountGateway;
  withdrawAccountPresenter: OutputPort<WithdrawAccountOutput>;
}

export type WithdrawAccountInput = {
  identifier: string;
  amount: number;
};

export type WithdrawAccountData = {
  account: Account;
};

export type WithdrawAccountOutput = {
  success: boolean;
  data?: WithdrawAccountData;
  failure?: {
    data: any;
  };
};
