import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WithdrawAccountInteractor } from '../../../../src/use-cases/api/withdraw-account';
import { makeWithdrawAccountSut, makeWithdrawAccountObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';
import { Account } from '../../../../src/entities';

describe('WithdrawAccountInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should be true when WithdrawAccount execute with success', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();

      const mockAccount = {
        getProps: () => ({
          identifier: 'any_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 1000
        }),
        balance: 1000
      };

      vi.mocked(withdrawAccountGateway.findAccountByIdentifier).mockResolvedValue(mockAccount as Account);
      vi.mocked(withdrawAccountGateway.updateAccount).mockResolvedValue(mockAccount as Account);
      vi.mocked(withdrawAccountPresenter.show).mockReturnValue({
        success: true,
        data: { account: mockAccount }
      });

      await withdrawAccountInteractor.execute(withdrawAccountInput);

      expect(withdrawAccountGateway.logInfo).toHaveBeenCalledTimes(2);
      expect(withdrawAccountGateway.logInfo).toHaveBeenCalledWith('WithdrawAccount request received', {
        inputTxt: JSON.stringify(withdrawAccountInput)
      });
      expect(withdrawAccountGateway.logInfo).toHaveBeenCalledWith('WithdrawAccount completed successfully', {
        outputTxt: JSON.stringify(mockAccount)
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: true,
        data: { account: mockAccount }
      });
    });

    it('should execute WithdrawAccount with correct results for valid input', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();

      const mockAccount = {
        getProps: () => ({
          identifier: 'any_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 1000
        }),
        balance: 1000
      };

      vi.mocked(withdrawAccountGateway.findAccountByIdentifier).mockResolvedValue(mockAccount as Account);
      vi.mocked(withdrawAccountGateway.updateAccount).mockResolvedValue(mockAccount as Account);
      vi.mocked(withdrawAccountPresenter.show).mockReturnValue({
        success: true,
        data: { account: mockAccount }
      });

      const result = await withdrawAccountInteractor.execute(withdrawAccountInput);

      expect(result).toEqual({
        success: true,
        data: { account: mockAccount }
      });
      expect(withdrawAccountGateway.findAccountByIdentifier).toHaveBeenCalledWith(withdrawAccountInput.identifier);
      expect(withdrawAccountGateway.updateAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          balance: mockAccount.balance - withdrawAccountInput.amount
        })
      );
    });
  });

  describe('Error cases', () => {
    it('should throw an error if identifier is undefined', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();
      const inputError = {
        ...withdrawAccountInput,
        identifier: ''
      };

      const err = new Errors.MissingParam('identifier');

      await withdrawAccountInteractor.execute(inputError);

      expect(withdrawAccountGateway.logError).toHaveBeenCalledWith('WithdrawAccount error', {
        exception: err
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if amount is undefined', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();
      const inputError = {
        ...withdrawAccountInput,
        amount: undefined
      } as any;

      const err = new Errors.MissingParam('amount');

      await withdrawAccountInteractor.execute(inputError);

      expect(withdrawAccountGateway.logError).toHaveBeenCalledWith('WithdrawAccount error', {
        exception: err
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if amount is not positive', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();
      const inputError = {
        ...withdrawAccountInput,
        amount: 0
      };

      const err = new Errors.InvalidParam('amount must be greater than zero');

      await withdrawAccountInteractor.execute(inputError);

      expect(withdrawAccountGateway.logError).toHaveBeenCalledWith('WithdrawAccount error', {
        exception: err
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if account is not found', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();

      vi.mocked(withdrawAccountGateway.findAccountByIdentifier).mockResolvedValue(null);

      const err = new Errors.NotFoundError('Account not found');

      await withdrawAccountInteractor.execute(withdrawAccountInput);

      expect(withdrawAccountGateway.logError).toHaveBeenCalledWith('WithdrawAccount error', {
        exception: err
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if account has insufficient funds', async () => {
      const { withdrawAccountInteractor, withdrawAccountGateway, withdrawAccountPresenter } =
        makeWithdrawAccountSut();
      const { withdrawAccountInput } = makeWithdrawAccountObjects();

      const mockAccount = {
        getProps: () => ({
          identifier: 'any_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 50
        }),
        balance: 50
      };

      const inputWithHigherAmount = {
        ...withdrawAccountInput,
        amount: 100
      };

      vi.mocked(withdrawAccountGateway.findAccountByIdentifier).mockResolvedValue(mockAccount as Account);

      const err = new Errors.InvalidParam('Insufficient funds');

      await withdrawAccountInteractor.execute(inputWithHigherAmount);

      expect(withdrawAccountGateway.logError).toHaveBeenCalledWith('WithdrawAccount error', {
        exception: err
      });
      expect(withdrawAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });
  });
});
