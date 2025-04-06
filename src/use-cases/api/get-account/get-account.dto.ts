import { OutputPort } from '@useCases';
import { GetAccountGateway } from './get-account.gateway';
import { Account } from '@entities';

export interface GetAccountInjections {
  getAccountGateway: GetAccountGateway;
  getAccountPresenter: OutputPort<GetAccountOutput>;
}

export type GetAccountInput = {
  identifier: string;
};

export type GetAccountData = {
  account: Account;
};

export type GetAccountOutput = {
  success: boolean;
  data?: GetAccountData;
  failure?: {
    data: any;
  };
};
