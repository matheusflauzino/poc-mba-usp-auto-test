import { describe, vi, it, expect, beforeEach } from 'vitest';
import { makeCreateAccountSut, makeCreateAccountObjects } from '../../mocks/suts';
import { Errors } from '../../../../src/shared';

describe('CreateAccountInteractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success cases', () => {
    it('should be true when CreateAccount execute with success', async () => {
      const { createAccountInteractor, createAccountGateway, createAccountPresenter } =
        makeCreateAccountSut();

      const { createAccountInput } = makeCreateAccountObjects();

      await createAccountInteractor.execute(createAccountInput);

      expect(createAccountGateway.logInfo).toBeCalledTimes(2);
      expect(createAccountGateway.saveAccount).toBeCalledTimes(1);
      expect(createAccountPresenter.show).toBeCalledTimes(1);
    });

    it('should execute CreateAccount with correct results for valid input', async () => {
      const { createAccountInteractor, createAccountGateway, createAccountPresenter } =
        makeCreateAccountSut();

      const { createAccountInput } = makeCreateAccountObjects();

      const output = await createAccountInteractor.execute(createAccountInput);

      expect(createAccountGateway.logInfo).toBeCalledTimes(2);
      expect(createAccountGateway.saveAccount).toBeCalledTimes(1);
      expect(createAccountPresenter.show).toBeCalledWith(
        expect.objectContaining({
          success: true,
          data: {
            account: expect.objectContaining({
              identifier: expect.any(String),
              name: createAccountInput.name,
              email: createAccountInput.email,
              document: createAccountInput.document,
              balance: 0
            })
          }
        })
      );
    });
  });

  describe('error cases', () => {
    it('should throw an error if field (name) is undefined', async () => {
      const { createAccountInteractor, createAccountGateway, createAccountPresenter } =
        makeCreateAccountSut();
      const { createAccountInput } = makeCreateAccountObjects();
      const inputError = {
        ...createAccountInput,
        name: undefined
      };

      const err = new Errors.MissingParam('name');

      await createAccountInteractor.execute(<any>inputError);

      expect(createAccountGateway.logError).toHaveBeenCalledWith('CreateAccount error', {
        exception: err
      });
      expect(createAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if field (email) is undefined', async () => {
      const { createAccountInteractor, createAccountGateway, createAccountPresenter } =
        makeCreateAccountSut();
      const { createAccountInput } = makeCreateAccountObjects();
      const inputError = {
        ...createAccountInput,
        email: undefined
      };

      const err = new Errors.MissingParam('email');

      await createAccountInteractor.execute(<any>inputError);

      expect(createAccountGateway.logError).toHaveBeenCalledWith('CreateAccount error', {
        exception: err
      });
      expect(createAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });

    it('should throw an error if field (document) is undefined', async () => {
      const { createAccountInteractor, createAccountGateway, createAccountPresenter } =
        makeCreateAccountSut();
      const { createAccountInput } = makeCreateAccountObjects();
      const inputError = {
        ...createAccountInput,
        document: undefined
      };

      const err = new Errors.MissingParam('document');

      await createAccountInteractor.execute(<any>inputError);

      expect(createAccountGateway.logError).toHaveBeenCalledWith('CreateAccount error', {
        exception: err
      });
      expect(createAccountPresenter.show).toHaveBeenCalledWith({
        success: false,
        failure: { data: err }
      });
    });
  });
});
