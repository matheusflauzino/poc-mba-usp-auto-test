import { vi } from 'vitest';
import { LoanSimulationInteractor } from '../../../../../src/use-cases/api/loan-simulation';
import { LoanSimulationsInput } from '../../../../../src/use-cases';

/* Objects */
export const makeLoanSimulationObjects = () => {
  const loanSimulationInput: LoanSimulationsInput = {
    simulations: [
      {
        principal: 10000, // Valor do empréstimo (R$100,00)
        birthDate: '1990-01-01', // Data de nascimento do cliente
        months: 12, // Prazo em meses
      },
    ]
  };

  return {
    loanSimulationInput
  };
};

/* Suts */
interface LoanSimulationGatewayTypes {
  logInfo: ReturnType<typeof vi.fn>;
  logError: ReturnType<typeof vi.fn>;
  logCritical: ReturnType<typeof vi.fn>;
  sendBatchMessagesToOwnQueue: ReturnType<typeof vi.fn>;

}

interface LoanSimulationPresenterTypes {
  show: ReturnType<typeof vi.fn>;
}

interface SutTypes {
  loanSimulationInteractor: LoanSimulationInteractor;
  loanSimulationGateway: LoanSimulationGatewayTypes;
  loanSimulationPresenter: LoanSimulationPresenterTypes;
}

export const makeLoanSimulationSut = (): SutTypes => {
  const loanSimulationGateway = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    logCritical: vi.fn(),
    sendBatchMessagesToOwnQueue: vi.fn(),
  };

  const loanSimulationPresenter = {
    show: vi.fn()
  };

  const loanSimulationInteractor = new LoanSimulationInteractor({
    loanSimulationGateway,
    loanSimulationPresenter
  });

  return {
    loanSimulationInteractor,
    loanSimulationGateway,
    loanSimulationPresenter
  };
};
