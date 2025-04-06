import { Simulation } from '@entities';
import { GConstructor, ISimulationMapper } from '../dtos';

export function MixSimulationRepository<TBase extends GConstructor>(Base: TBase) {
  return class SimulationRepository extends Base {
    public _simulationMapper: ISimulationMapper;

    constructor(...args: any[]) {
      super(...args);
      this._simulationMapper = args[0].simulationMapper;
    }

    async saveSimulation(data: Simulation): Promise<void> {
      await this._simulationMapper.save(data);
    }

    async findSimulation(identifier: string): Promise<Simulation | undefined> {
      return this._simulationMapper.find(identifier);
    }
  };
}
