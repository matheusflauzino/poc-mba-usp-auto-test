import { OutputPort } from '@useCases';
import { CloseAccountGateway } from './close-account.gateway';

export interface CloseAccountInjections {
  closeAccountGateway: CloseAccountGateway;
  closeAccountPresenter: OutputPort<CloseAccountOutput>;
}

export type CloseAccountInput = {
  identifier: string;
};

export type CloseAccountOutput = {
  success: boolean;
  failure?: {
    data: any;
  };
};
