import { describe, vi, it, expect, beforeEach } from 'vitest';
import { makeLoanSimulationSut, makeLoanSimulationObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';

describe('LoanSimulationInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success cases', () => {
    it('should be true when LoanSimulation execute with success', async () => {
      const { loanSimulationInteractor, loanSimulationGateway, loanSimulationPresenter } =
        makeLoanSimulationSut();

      const { loanSimulationInput } = makeLoanSimulationObjects();

      await loanSimulationInteractor.execute(loanSimulationInput);

      expect(loanSimulationGateway.logInfo).toBeCalledTimes(3);
      expect(loanSimulationGateway.sendBatchMessagesToOwnQueue).toBeCalledTimes(1);
      expect(loanSimulationPresenter.show).toBeCalledTimes(1);
    });


    it('should execute LoanSimulation with correct results for valid input', async () => {
      const { loanSimulationInteractor, loanSimulationGateway, loanSimulationPresenter } =
        makeLoanSimulationSut();

      const { loanSimulationInput } = makeLoanSimulationObjects();

      const output = await loanSimulationInteractor.execute(loanSimulationInput);

      expect(loanSimulationGateway.logInfo).toBeCalledTimes(3);
      expect(loanSimulationGateway.sendBatchMessagesToOwnQueue).toBeCalledTimes(1);
      expect(loanSimulationPresenter.show).toBeCalledWith(
        expect.objectContaining({
          success: true,
          data: { simulations: expect.any(Array) },

        })
      );
    });


  });

  describe('error cases', () => {
    it('should throw an error if field (simulations) is undefined', async () => {
      const { loanSimulationInteractor, loanSimulationGateway, loanSimulationPresenter } =
        makeLoanSimulationSut();
      const { loanSimulationInput } = makeLoanSimulationObjects();
      const inputError = {
        ...loanSimulationInput,
        simulations: undefined
      };

      const err = new Errors.MissingParam('simulations');

      await loanSimulationInteractor.execute(<any>inputError);

      expect(loanSimulationGateway.logError).toHaveBeenCalledWith('LoanSimulation error', {
        exception: err
      });
      expect(loanSimulationPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });
  });
});
