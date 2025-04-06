import { OutputPort } from '../../output-port';
import { LoanSimulationGateway } from './loan-simulation.gateway';

export interface LoanSimulationInjections {
  loanSimulationGateway: LoanSimulationGateway;
  loanSimulationPresenter: OutputPort<LoanSimulationOutput>;
}

export type SimulationInput = {
  principal: number;
  birthDate: string;
  months: number;
}

export type LoanSimulationsInput = {
  simulations: SimulationInput[];
};

export type LoanSimulationData = {
  simulations: any[];
};

export type LoanSimulationOutput = {
  success: boolean;
  data?: LoanSimulationData;
  failure?: {
    data: any;
  };
};
