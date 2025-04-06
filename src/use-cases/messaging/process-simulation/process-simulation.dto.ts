import { ProcessSimulationGateway } from './process-simulation.gateway';

export interface ProcessSimulationInjections {
  processSimulationGateway: ProcessSimulationGateway;
}

export type ProcessSimulationInput = {
  simulation: any;
};

