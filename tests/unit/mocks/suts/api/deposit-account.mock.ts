import { vi } from 'vitest';
import { DepositAccountInteractor } from '../../../../../src/use-cases/api/deposit-account';
import { DepositAccountInput } from '../../../../../src/use-cases';

/* Objects */
export const makeDepositAccountObjects = () => {
  const depositAccountInput: DepositAccountInput = {
    identifier: '123456789',
    amount: 100
  };

  return {
    depositAccountInput
  };
};

/* Suts */
interface DepositAccountGatewayTypes {
  logInfo: ReturnType<typeof vi.fn>;
  logError: ReturnType<typeof vi.fn>;
  findAccountByIdentifier: ReturnType<typeof vi.fn>;
  updateAccount: ReturnType<typeof vi.fn>;
}

interface DepositAccountPresenterTypes {
  show: ReturnType<typeof vi.fn>;
}

interface SutTypes {
  depositAccountInteractor: DepositAccountInteractor;
  depositAccountGateway: DepositAccountGatewayTypes;
  depositAccountPresenter: DepositAccountPresenterTypes;
}

export const makeDepositAccountSut = (): SutTypes => {
  const depositAccountGateway = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    findAccountByIdentifier: vi.fn(),
    updateAccount: vi.fn()
  };

  const depositAccountPresenter = {
    show: vi.fn()
  };

  const depositAccountInteractor = new DepositAccountInteractor({
    depositAccountGateway,
    depositAccountPresenter
  });

  return {
    depositAccountInteractor,
    depositAccountGateway,
    depositAccountPresenter
  };
};
