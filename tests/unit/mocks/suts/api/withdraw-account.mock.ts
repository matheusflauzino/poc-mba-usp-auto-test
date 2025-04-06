import { vi } from 'vitest';
import { WithdrawAccountInteractor } from '../../../../../src/use-cases/api/withdraw-account';
import { WithdrawAccountInput } from '../../../../../src/use-cases/api/withdraw-account';

export function makeWithdrawAccountObjects() {
  const withdrawAccountInput: WithdrawAccountInput = {
    identifier: 'any_identifier',
    amount: 100
  };

  return {
    withdrawAccountInput
  };
}

interface WithdrawAccountGatewayTypes {
  logInfo: (message: string, meta?: any) => void;
  logError: (message: string, meta?: any) => void;
  findAccountByIdentifier: (identifier: string) => Promise<any>;
  updateAccount: (account: any) => Promise<any>;
}

interface WithdrawAccountPresenterTypes {
  show: (response: any) => any;
}

export function makeWithdrawAccountSut() {
  const withdrawAccountGateway: WithdrawAccountGatewayTypes = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    findAccountByIdentifier: vi.fn(),
    updateAccount: vi.fn()
  };

  const withdrawAccountPresenter: WithdrawAccountPresenterTypes = {
    show: vi.fn()
  };

  const withdrawAccountInteractor = new WithdrawAccountInteractor({
    withdrawAccountGateway,
    withdrawAccountPresenter
  });

  return {
    withdrawAccountInteractor,
    withdrawAccountGateway,
    withdrawAccountPresenter
  };
}
