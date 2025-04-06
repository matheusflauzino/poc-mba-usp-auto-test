import { OutputPort } from '../../output-port';
import { CreateAccountGateway } from './create-account.gateway';

export interface CreateAccountInjections {
  createAccountGateway: CreateAccountGateway;
  createAccountPresenter: OutputPort<CreateAccountOutput>;
}

export type CreateAccountInput = {
  name: string;
  email: string;
  document: string;
};

export type CreateAccountData = {
  account: {
    identifier: string;
    name: string;
    email: string;
    document: string;
    balance: number;
  };
};

export type CreateAccountOutput = {
  success: boolean;
  data?: CreateAccountData;
  failure?: {
    data: any;
  };
};
