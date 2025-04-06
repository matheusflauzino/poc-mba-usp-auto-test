import { vi } from 'vitest';
import { TransferAccountInteractor } from '../../../../../src/use-cases/api/transfer-account';
import { TransferAccountInput } from '../../../../../src/use-cases/api/transfer-account';
import { TransferAccountOutput } from '../../../../../src/use-cases/api/transfer-account';
import { TransferAccountGateway } from '../../../../../src/use-cases/api/transfer-account';
import { OutputPort } from '../../../../../src/use-cases';
import { Account } from '../../../../../src/entities';

export function makeTransferAccountObjects() {
  const transferAccountInput: TransferAccountInput = {
    sourceIdentifier: 'any_source_identifier',
    targetIdentifier: 'any_target_identifier',
    amount: 100
  };

  return {
    transferAccountInput
  };
}

interface TransferAccountGatewayTypes {
  logInfo: (message: string, meta?: any) => void;
  logError: (message: string, meta?: any) => void;
  findAccountByIdentifier: (identifier: string) => Promise<any>;
  updateAccount: (account: any) => Promise<any>;
}

interface TransferAccountPresenterTypes {
  show: (response: any) => any;
}

export function makeTransferAccountSut() {
  const transferAccountGateway: TransferAccountGatewayTypes = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    findAccountByIdentifier: vi.fn(),
    updateAccount: vi.fn()
  };

  const transferAccountPresenter: TransferAccountPresenterTypes = {
    show: vi.fn()
  };

  const transferAccountInteractor = new TransferAccountInteractor({
    transferAccountGateway,
    transferAccountPresenter
  });

  return {
    transferAccountInteractor,
    transferAccountGateway,
    transferAccountPresenter
  };
}
