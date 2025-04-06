import { describe, vi, it, expect, beforeEach } from 'vitest';
import { makeDepositAccountSut, makeDepositAccountObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';
import { Account } from '../../../../src/entities';

describe('DepositAccountInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success cases', () => {
    it('should be true when DepositAccount execute with success', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();

      const { depositAccountInput } = makeDepositAccountObjects();

      // Criar uma instância real de Account para o mock
      const mockAccountProps = {
        identifier: depositAccountInput.identifier,
        name: 'John Doe',
        email: 'john@example.com',
        document: '123.456.789-00',
        balance: 100
      };

      const mockAccount = Account.build(mockAccountProps).value;

      // Configurar os mocks
      depositAccountGateway.findAccountByIdentifier.mockResolvedValue(mockAccount);
      depositAccountGateway.updateAccount.mockResolvedValue(mockAccount);

      await depositAccountInteractor.execute(depositAccountInput);

      expect(depositAccountGateway.logInfo).toBeCalledTimes(2);
      expect(depositAccountGateway.findAccountByIdentifier).toBeCalledTimes(1);
      expect(depositAccountGateway.updateAccount).toBeCalledTimes(1);
      expect(depositAccountPresenter.show).toBeCalledTimes(1);
    });

    it('should execute DepositAccount with correct results for valid input', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();

      const { depositAccountInput } = makeDepositAccountObjects();

      // Criar uma instância real de Account para o mock
      const mockAccountProps = {
        identifier: depositAccountInput.identifier,
        name: 'John Doe',
        email: 'john@example.com',
        document: '123.456.789-00',
        balance: 100
      };

      const mockAccount = Account.build(mockAccountProps).value;

      // Configurar os mocks
      depositAccountGateway.findAccountByIdentifier.mockResolvedValue(mockAccount);
      depositAccountGateway.updateAccount.mockResolvedValue(mockAccount);

      const output = await depositAccountInteractor.execute(depositAccountInput);

      expect(depositAccountGateway.logInfo).toBeCalledTimes(2);
      expect(depositAccountGateway.findAccountByIdentifier).toBeCalledWith(depositAccountInput.identifier);
      expect(depositAccountGateway.updateAccount).toBeCalledWith(
        expect.objectContaining({
          identifier: depositAccountInput.identifier,
          balance: mockAccount.balance + depositAccountInput.amount
        })
      );
      expect(depositAccountPresenter.show).toBeCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            account: expect.objectContaining({
              identifier: depositAccountInput.identifier
            })
          }
        })
      );
    });
  });

  describe('error cases', () => {
    it('should throw an error if field (identifier) is undefined', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();
      const { depositAccountInput } = makeDepositAccountObjects();
      const inputError = {
        ...depositAccountInput,
        identifier: undefined
      };

      const err = new Errors.MissingParam('identifier');

      await depositAccountInteractor.execute(<any>inputError);

      expect(depositAccountGateway.logError).toHaveBeenCalledWith('DepositAccount error', {
        exception: err
      });
      expect(depositAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if field (amount) is undefined', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();
      const { depositAccountInput } = makeDepositAccountObjects();
      const inputError = {
        ...depositAccountInput,
        amount: undefined
      };

      const err = new Errors.MissingParam('amount');

      await depositAccountInteractor.execute(<any>inputError);

      expect(depositAccountGateway.logError).toHaveBeenCalledWith('DepositAccount error', {
        exception: err
      });
      expect(depositAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if amount is not positive', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();
      const { depositAccountInput } = makeDepositAccountObjects();
      const inputError = {
        ...depositAccountInput,
        amount: 0
      };

      const err = new Errors.InvalidParam('amount must be greater than zero');

      await depositAccountInteractor.execute(inputError);

      expect(depositAccountGateway.logError).toHaveBeenCalledWith('DepositAccount error', {
        exception: err
      });
      expect(depositAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if account is not found', async () => {
      const { depositAccountInteractor, depositAccountGateway, depositAccountPresenter } =
        makeDepositAccountSut();
      const { depositAccountInput } = makeDepositAccountObjects();

      depositAccountGateway.findAccountByIdentifier.mockResolvedValue(null);

      const err = new Errors.NotFoundError('Account not found');

      await depositAccountInteractor.execute(depositAccountInput);

      expect(depositAccountGateway.logError).toHaveBeenCalledWith('DepositAccount error', {
        exception: err
      });
      expect(depositAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });
  });
});
