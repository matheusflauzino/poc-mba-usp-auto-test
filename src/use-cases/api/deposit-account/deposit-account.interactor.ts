import { DepositAccountInjections, DepositAccountInput, DepositAccountOutput } from '.';
import { InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors } from '@shared';
import { DepositAccountGateway } from './deposit-account.gateway';
import { Account } from '@entities';

export default class DepositAccountInteractor extends InteractorValidatable {
  private readonly _gateway: DepositAccountGateway;
  private readonly _presenter: OutputPort<DepositAccountOutput>;

  constructor(params: DepositAccountInjections) {
    super();
    this._gateway = params.depositAccountGateway;
    this._presenter = params.depositAccountPresenter;
  }

  public async execute(input: DepositAccountInput): Promise<DepositAccountOutput> {
    this._gateway.logInfo('DepositAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      const account = await this._gateway.findAccountByIdentifier(input.identifier);

      if (!account) {
        throw new Errors.NotFoundError('Account not found');
      }

      // Adiciona o valor do depósito ao saldo atual
      const updatedAccount = Account.build({
        ...account.getProps(),
        balance: account.balance + input.amount
      }).value;

      // Salva a conta atualizada
      const savedAccount = await this._gateway.updateAccount(updatedAccount);

      this._gateway.logInfo('DepositAccount completed successfully', {
        outputTxt: JSON.stringify(savedAccount)
      });

      return this._presenter.show({
        success: true,
        data: { account: savedAccount }
      });
    } catch (err: any) {
      this._gateway.logError('DepositAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: DepositAccountInput) {
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
