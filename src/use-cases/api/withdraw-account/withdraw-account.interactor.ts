import { WithdrawAccountInjections, WithdrawAccountInput, WithdrawAccountOutput } from '.';
import { InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors } from '@shared';
import { WithdrawAccountGateway } from './withdraw-account.gateway';
import { Account } from '@entities';

export default class WithdrawAccountInteractor extends InteractorValidatable {
  private readonly _gateway: WithdrawAccountGateway;
  private readonly _presenter: OutputPort<WithdrawAccountOutput>;

  constructor(params: WithdrawAccountInjections) {
    super();
    this._gateway = params.withdrawAccountGateway;
    this._presenter = params.withdrawAccountPresenter;
  }

  public async execute(input: WithdrawAccountInput): Promise<WithdrawAccountOutput> {
    this._gateway.logInfo('WithdrawAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      const account = await this._gateway.findAccountByIdentifier(input.identifier);

      if (!account) {
        throw new Errors.NotFoundError('Account not found');
      }

      if (account.balance < input.amount) {
        throw new Errors.InvalidParam('Insufficient funds');
      }

      // Subtrai o valor do saque do saldo atual
      const updatedAccount = Account.build({
        ...account.getProps(),
        balance: account.balance - input.amount
      }).value;

      // Salva a conta atualizada
      const savedAccount = await this._gateway.updateAccount(updatedAccount);

      this._gateway.logInfo('WithdrawAccount completed successfully', {
        outputTxt: JSON.stringify(savedAccount)
      });

      return this._presenter.show({
        success: true,
        data: { account: savedAccount }
      });
    } catch (err: any) {
      this._gateway.logError('WithdrawAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: WithdrawAccountInput) {
    if (!input?.identifier) {
      throw new Errors.MissingParam('identifier');
    }

    if (input.amount === undefined || input.amount === null) {
      throw new Errors.MissingParam('amount');
    }

    if (input.amount <= 0) {
      throw new Errors.InvalidParam('amount must be greater than zero');
    }
  }
}
