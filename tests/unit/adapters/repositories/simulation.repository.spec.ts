import { describe, it, expect, vi } from 'vitest';
import { MixSimulationRepository } from '../../../../src/adapters/repositories/simulation.repository';

class Base {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(...args: any[]) { }
}

const SimulationRepository = MixSimulationRepository(Base);

const params: any = {
  simulationMapper: {
    find: vi.fn(),
    save: vi.fn()
  }
};

const repository = new SimulationRepository(params);

describe('simulation repository', () => {
  const data = {};
  const identifier = '123';

  it('should execute findSimulation', async () => {
    await repository.findSimulation(identifier);
    expect(repository._simulationMapper.find).toBeCalledTimes(1);
    expect(repository._simulationMapper.find).toBeCalledWith('123');
  });

  it('should execute saveSimulation', async () => {
    await repository.saveSimulation(data);
    expect(repository._simulationMapper.save).toBeCalledTimes(1);
  });
});
