import { LogData } from '@adapters';
import { Simulation } from '@entities';

export interface ProcessSimulationGateway {
  /* Log */
  logInfo(message: string, data?: LogData): void;
  logError(message: string, data?: LogData): void;
  logCritical(message: string, data?: LogData): void;

  saveSimulation(simulation: Simulation): Promise<void>;
}
