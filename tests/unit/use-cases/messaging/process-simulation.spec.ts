import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProcessSimulationInteractor } from '../../../../src/use-cases/messaging/process-simulation';
import { makeProcessSimulationSut, makeProcessSimulationObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';
import { Simulation } from '../../../../src/entities';

describe('ProcessSimulationInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should process simulation successfully', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();
      const { processSimulationInput } = makeProcessSimulationObjects();

      // Mock para o método build da entidade Simulation
      vi.spyOn(Simulation, 'build').mockReturnValue({
        value: {
          principal: processSimulationInput.simulation.principal,
          annualInterestRate: processSimulationInput.simulation.annualInterestRate,
          months: processSimulationInput.simulation.months
        }
      });

      await processSimulationInteractor.execute(processSimulationInput);

      expect(processSimulationGateway.logInfo).toHaveBeenCalledTimes(2);
      expect(processSimulationGateway.logInfo).toHaveBeenCalledWith('ProcessSimulation request received');
      expect(processSimulationGateway.logInfo).toHaveBeenCalledWith('Successfully process simulation data');
      expect(processSimulationGateway.saveSimulation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error cases', () => {
    it('should throw an error if simulation is empty', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();

      // Criando um objeto vazio para simulação
      const inputError = {
        simulation: {}
      };

      // Mock para o método build da entidade Simulation para lançar erro
      vi.spyOn(Simulation, 'build').mockImplementation(() => {
        throw new Errors.ApplicationError('simulation');
      });

      try {
        await processSimulationInteractor.execute(inputError);
        // Se chegou aqui, o teste falhou porque deveria ter lançado um erro
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.ApplicationError);
        expect(processSimulationGateway.logError).toHaveBeenCalledWith('ProcessSimulation error', {
          exception: error
        });
      }
    });

    it('should throw an error if simulation is undefined', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();

      const inputError = {
        simulation: undefined
      };

      // Mock para o método build da entidade Simulation para lançar erro
      vi.spyOn(Simulation, 'build').mockImplementation(() => {
        throw new Errors.ApplicationError('simulation');
      });

      try {
        await processSimulationInteractor.execute(inputError as any);
        // Se chegou aqui, o teste falhou porque deveria ter lançado um erro
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.ApplicationError);
        expect(processSimulationGateway.logError).toHaveBeenCalledWith('ProcessSimulation error', {
          exception: error
        });
      }
    });

    it('should throw an error if simulation is null', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();

      const inputError = {
        simulation: null
      };

      // Mock para o método build da entidade Simulation para lançar erro
      vi.spyOn(Simulation, 'build').mockImplementation(() => {
        throw new Errors.ApplicationError('simulation');
      });

      try {
        await processSimulationInteractor.execute(inputError as any);
        // Se chegou aqui, o teste falhou porque deveria ter lançado um erro
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.ApplicationError);
        expect(processSimulationGateway.logError).toHaveBeenCalledWith('ProcessSimulation error', {
          exception: error
        });
      }
    });

    it('should throw an error if simulation is an empty string', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();

      const inputError = {
        simulation: ''
      };

      // Mock para o método build da entidade Simulation para lançar erro
      vi.spyOn(Simulation, 'build').mockImplementation(() => {
        throw new Errors.ApplicationError('simulation');
      });

      try {
        await processSimulationInteractor.execute(inputError as any);
        // Se chegou aqui, o teste falhou porque deveria ter lançado um erro
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.ApplicationError);
        expect(processSimulationGateway.logError).toHaveBeenCalledWith('ProcessSimulation error', {
          exception: error
        });
      }
    });

    it('should throw an error if simulation is an empty array', async () => {
      const { processSimulationInteractor, processSimulationGateway } =
        makeProcessSimulationSut();

      const inputError = {
        simulation: []
      };

      // Mock para o método build da entidade Simulation para lançar erro
      vi.spyOn(Simulation, 'build').mockImplementation(() => {
        throw new Errors.ApplicationError('simulation');
      });

      try {
        await processSimulationInteractor.execute(inputError as any);
        // Se chegou aqui, o teste falhou porque deveria ter lançado um erro
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.ApplicationError);
        expect(processSimulationGateway.logError).toHaveBeenCalledWith('ProcessSimulation error', {
          exception: error
        });
      }
    });
  });
});
