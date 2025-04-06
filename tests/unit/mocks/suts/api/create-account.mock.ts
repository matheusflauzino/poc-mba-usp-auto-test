import { vi } from 'vitest';
import { CreateAccountInteractor } from '../../../../../src/use-cases/api/create-account';
import { CreateAccountInput } from '../../../../../src/use-cases';

/* Objects */
export const makeCreateAccountObjects = () => {
  const createAccountInput: CreateAccountInput = {
    name: 'John Doe',
    email: 'john@example.com',
    document: '123.456.789-00'
  };

  return {
    createAccountInput
  };
};

/* Suts */
interface CreateAccountGatewayTypes {
  logInfo: ReturnType<typeof vi.fn>;
  logError: ReturnType<typeof vi.fn>;
  saveAccount: ReturnType<typeof vi.fn>;
}

interface CreateAccountPresenterTypes {
  show: ReturnType<typeof vi.fn>;
}

interface SutTypes {
  createAccountInteractor: CreateAccountInteractor;
  createAccountGateway: CreateAccountGatewayTypes;
  createAccountPresenter: CreateAccountPresenterTypes;
}

export const makeCreateAccountSut = (): SutTypes => {
  const createAccountGateway = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    saveAccount: vi.fn()
  };

  const createAccountPresenter = {
    show: vi.fn()
  };

  const createAccountInteractor = new CreateAccountInteractor({
    createAccountGateway,
    createAccountPresenter
  });

  return {
    createAccountInteractor,
    createAccountGateway,
    createAccountPresenter
  };
};
