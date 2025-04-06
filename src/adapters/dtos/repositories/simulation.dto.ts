import { Simulation } from '@entities';

export interface ISimulationMapper {
  find(identifier: string): Promise<Simulation | undefined>;
  save(simulation: Simulation): Promise<void>;
}
