import { describe, vi, it, expect, beforeEach } from 'vitest';
import { CloseAccountInteractor } from '../../../../src/use-cases/api/close-account';
import { CloseAccountPresenter } from '../../../../src/adapters/presenters';
import { MissingParam, NotFoundError } from '../../../../src/shared/errors';

describe('CloseAccountInteractor', () => {
  const mockAccount = {
    identifier: '123456789',
    name: 'John Doe',
    email: 'john@example.com',
    document: '123.456.789-00',
    balance: 1000
  };

  const mockGateway = {
    logInfo: vi.fn(),
    logError: vi.fn(),
    findAccountByIdentifier: vi.fn().mockResolvedValue(mockAccount),
    deleteAccount: vi.fn().mockResolvedValue(undefined)
  };

  const mockPresenter = new CloseAccountPresenter();

  const interactor = new CloseAccountInteractor({
    closeAccountGateway: mockGateway,
    closeAccountPresenter: mockPresenter
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success cases', () => {
    it('should close account when account exists', async () => {
      const input = { identifier: '123456789' };

      const result = await interactor.execute(input);

      expect(mockGateway.logInfo).toHaveBeenCalledTimes(2);
      expect(mockGateway.findAccountByIdentifier).toHaveBeenCalledWith(input.identifier);
      expect(mockGateway.deleteAccount).toHaveBeenCalledWith(input.identifier);
      expect(result.success).toBe(true);
    });
  });

  describe('error cases', () => {
    it('should throw error when identifier is missing', async () => {
      const input = { identifier: '' };

      const result = await interactor.execute(input);

      expect(mockGateway.logError).toHaveBeenCalledWith('CloseAccount error', {
        exception: new MissingParam('identifier')
      });
      expect(result.success).toBe(false);
      expect(result.failure).toBeDefined();
    });

    it('should throw error when account is not found', async () => {
      const input = { identifier: 'non-existent' };
      mockGateway.findAccountByIdentifier.mockResolvedValueOnce(null);

      const result = await interactor.execute(input);

      expect(mockGateway.logError).toHaveBeenCalledWith('CloseAccount error', {
        exception: new NotFoundError('Account not found')
      });
      expect(result.success).toBe(false);
      expect(result.failure).toBeDefined();
    });
  });
});
