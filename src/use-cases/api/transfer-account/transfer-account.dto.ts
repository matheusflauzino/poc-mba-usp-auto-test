import { OutputPort } from '@useCases';
import { TransferAccountGateway } from './transfer-account.gateway';
import { Account } from '@entities';

export interface TransferAccountInjections {
  transferAccountGateway: TransferAccountGateway;
  transferAccountPresenter: OutputPort<TransferAccountOutput>;
}

export type TransferAccountInput = {
  sourceIdentifier: string;
  targetIdentifier: string;
  amount: number;
};

export type TransferAccountData = {
  sourceAccount: Account;
  targetAccount: Account;
};

export type TransferAccountOutput = {
  success: boolean;
  data?: TransferAccountData;
  failure?: {
    data: any;
  };
};
