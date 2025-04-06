import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferAccountInteractor } from '../../../../src/use-cases/api/transfer-account';
import { makeTransferAccountSut, makeTransferAccountObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';
import { Account } from '../../../../src/entities';

describe('TransferAccountInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should be true when TransferAccount execute with success', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();

      const mockSourceAccount = {
        getProps: () => ({
          identifier: 'any_source_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 1000
        }),
        balance: 1000
      };

      const mockTargetAccount = {
        getProps: () => ({
          identifier: 'any_target_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 500
        }),
        balance: 500
      };

      vi.mocked(transferAccountGateway.findAccountByIdentifier)
        .mockResolvedValueOnce(mockSourceAccount as Account)
        .mockResolvedValueOnce(mockTargetAccount as Account);

      vi.mocked(transferAccountGateway.updateAccount)
        .mockResolvedValueOnce({ ...mockSourceAccount, balance: 900 } as Account)
        .mockResolvedValueOnce({ ...mockTargetAccount, balance: 600 } as Account);

      vi.mocked(transferAccountPresenter.show).mockReturnValue({
        success: true,
        data: {
          sourceAccount: { ...mockSourceAccount, balance: 900 },
          targetAccount: { ...mockTargetAccount, balance: 600 }
        }
      });

      await transferAccountInteractor.execute(transferAccountInput);

      expect(transferAccountGateway.logInfo).toHaveBeenCalledTimes(2);
      expect(transferAccountGateway.logInfo).toHaveBeenCalledWith('TransferAccount request received', {
        inputTxt: JSON.stringify(transferAccountInput)
      });
      expect(transferAccountGateway.logInfo).toHaveBeenCalledWith('TransferAccount completed successfully', {
        outputTxt: JSON.stringify({
          sourceAccount: { ...mockSourceAccount, balance: 900 },
          targetAccount: { ...mockTargetAccount, balance: 600 }
        })
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: true,
        data: {
          sourceAccount: { ...mockSourceAccount, balance: 900 },
          targetAccount: { ...mockTargetAccount, balance: 600 }
        }
      });
    });

    it('should execute TransferAccount with correct results for valid input', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();

      const mockSourceAccount = {
        getProps: () => ({
          identifier: 'any_source_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 1000
        }),
        balance: 1000
      };

      const mockTargetAccount = {
        getProps: () => ({
          identifier: 'any_target_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 500
        }),
        balance: 500
      };

      vi.mocked(transferAccountGateway.findAccountByIdentifier)
        .mockResolvedValueOnce(mockSourceAccount as Account)
        .mockResolvedValueOnce(mockTargetAccount as Account);

      vi.mocked(transferAccountGateway.updateAccount)
        .mockResolvedValueOnce({ ...mockSourceAccount, balance: 900 } as Account)
        .mockResolvedValueOnce({ ...mockTargetAccount, balance: 600 } as Account);

      vi.mocked(transferAccountPresenter.show).mockReturnValue({
        success: true,
        data: {
          sourceAccount: { ...mockSourceAccount, balance: 900 },
          targetAccount: { ...mockTargetAccount, balance: 600 }
        }
      });

      const result = await transferAccountInteractor.execute(transferAccountInput);

      expect(result).toEqual({
        success: true,
        data: {
          sourceAccount: { ...mockSourceAccount, balance: 900 },
          targetAccount: { ...mockTargetAccount, balance: 600 }
        }
      });
      expect(transferAccountGateway.findAccountByIdentifier).toHaveBeenCalledWith(transferAccountInput.sourceIdentifier);
      expect(transferAccountGateway.findAccountByIdentifier).toHaveBeenCalledWith(transferAccountInput.targetIdentifier);
      expect(transferAccountGateway.updateAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          balance: mockSourceAccount.balance - transferAccountInput.amount
        })
      );
      expect(transferAccountGateway.updateAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          balance: mockTargetAccount.balance + transferAccountInput.amount
        })
      );
    });
  });

  describe('Error cases', () => {
    it('should throw an error if sourceIdentifier is undefined', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();
      const inputError = {
        ...transferAccountInput,
        sourceIdentifier: undefined
      };

      const err = new Errors.MissingParam('sourceIdentifier');

      await transferAccountInteractor.execute(inputError as any);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if targetIdentifier is undefined', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();
      const inputError = {
        ...transferAccountInput,
        targetIdentifier: undefined
      };

      const err = new Errors.MissingParam('targetIdentifier');

      await transferAccountInteractor.execute(inputError as any);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if amount is undefined', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();
      const inputError = {
        ...transferAccountInput,
        amount: undefined
      };

      const err = new Errors.MissingParam('amount');

      await transferAccountInteractor.execute(inputError as any);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if amount is not positive', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();
      const inputError = {
        ...transferAccountInput,
        amount: 0
      };

      const err = new Errors.InvalidParam('amount must be greater than zero');

      await transferAccountInteractor.execute(inputError);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if source account is not found', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();

      vi.mocked(transferAccountGateway.findAccountByIdentifier).mockResolvedValue(null);

      const err = new Errors.NotFoundError('Source account not found');

      await transferAccountInteractor.execute(transferAccountInput);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if target account is not found', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();

      const mockSourceAccount = {
        getProps: () => ({
          identifier: 'any_source_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 1000
        }),
        balance: 1000
      };

      vi.mocked(transferAccountGateway.findAccountByIdentifier)
        .mockResolvedValueOnce(mockSourceAccount as Account)
        .mockResolvedValueOnce(null);

      const err = new Errors.NotFoundError('Target account not found');

      await transferAccountInteractor.execute(transferAccountInput);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if source account has insufficient funds', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();

      const mockSourceAccount = {
        getProps: () => ({
          identifier: 'any_source_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 50
        }),
        balance: 50
      };

      const mockTargetAccount = {
        getProps: () => ({
          identifier: 'any_target_identifier',
          name: 'any_name',
          email: 'any_email',
          document: 'any_document',
          balance: 500
        }),
        balance: 500
      };

      const inputWithHigherAmount = {
        ...transferAccountInput,
        amount: 100
      };

      vi.mocked(transferAccountGateway.findAccountByIdentifier)
        .mockResolvedValueOnce(mockSourceAccount as Account)
        .mockResolvedValueOnce(mockTargetAccount as Account);

      const err = new Errors.InvalidParam('Insufficient funds in source account');

      await transferAccountInteractor.execute(inputWithHigherAmount);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if source and target accounts are the same', async () => {
      const { transferAccountInteractor, transferAccountGateway, transferAccountPresenter } =
        makeTransferAccountSut();
      const { transferAccountInput } = makeTransferAccountObjects();
      const inputError = {
        ...transferAccountInput,
        sourceIdentifier: 'same_identifier',
        targetIdentifier: 'same_identifier'
      };

      const err = new Errors.InvalidParam('source and target accounts must be different');

      await transferAccountInteractor.execute(inputError);

      expect(transferAccountGateway.logError).toHaveBeenCalledWith('TransferAccount error', {
        exception: err
      });
      expect(transferAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });
  });
});
