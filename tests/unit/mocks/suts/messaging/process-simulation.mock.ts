import { vi } from 'vitest';
import { ProcessSimulationInteractor } from '../../../../../src/use-cases/messaging/process-simulation';
import { ProcessSimulationInput } from '../../../../../src/use-cases/messaging/process-simulation';
import { ProcessSimulationGateway } from '../../../../../src/use-cases/messaging/process-simulation';
import { Simulation } from '../../../../../src/entities';

export function makeProcessSimulationObjects() {
  const processSimulationInput: ProcessSimulationInput = {
    simulation: {
      principal: 10000,
      annualInterestRate: 10,
      months: 12
    }
  };

  return {
    processSimulationInput
  };
}

interface ProcessSimulationGatewayTypes {
  logInfo: (message: string, meta?: any) => void;
  logError: (message: string, meta?: any) => void;
  saveSimulation: (simulation: Simulation) => Promise<void>;
}

export function makeProcessSimulationSut() {
  const processSimulationGateway: ProcessSimulationGatewayTypes = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    saveSimulation: vi.fn()
  };

  const processSimulationInteractor = new ProcessSimulationInteractor({
    processSimulationGateway: processSimulationGateway as unknown as ProcessSimulationGateway
  });

  return {
    processSimulationInteractor,
    processSimulationGateway
  };
}
