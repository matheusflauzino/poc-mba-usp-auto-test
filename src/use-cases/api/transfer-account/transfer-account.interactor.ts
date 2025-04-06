import { TransferAccountInjections, TransferAccountInput, TransferAccountOutput } from '.';
import { InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors } from '@shared';
import { TransferAccountGateway } from './transfer-account.gateway';
import { Account } from '@entities';

export default class TransferAccountInteractor extends InteractorValidatable {
  private readonly _gateway: TransferAccountGateway;
  private readonly _presenter: OutputPort<TransferAccountOutput>;

  constructor(params: TransferAccountInjections) {
    super();
    this._gateway = params.transferAccountGateway;
    this._presenter = params.transferAccountPresenter;
  }

  public async execute(input: TransferAccountInput): Promise<TransferAccountOutput> {
    this._gateway.logInfo('TransferAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      // Busca as contas de origem e destino
      const sourceAccount = await this._gateway.findAccountByIdentifier(input.sourceIdentifier);
      const targetAccount = await this._gateway.findAccountByIdentifier(input.targetIdentifier);

      if (!sourceAccount) {
        throw new Errors.NotFoundError('Source account not found');
      }

      if (!targetAccount) {
        throw new Errors.NotFoundError('Target account not found');
      }

      if (sourceAccount.balance < input.amount) {
        throw new Errors.InvalidParam('Insufficient funds in source account');
      }

      // Atualiza o saldo da conta de origem (subtrai o valor)
      const updatedSourceAccount = Account.build({
        ...sourceAccount.getProps(),
        balance: sourceAccount.balance - input.amount
      }).value;

      // Atualiza o saldo da conta de destino (adiciona o valor)
      const updatedTargetAccount = Account.build({
        ...targetAccount.getProps(),
        balance: targetAccount.balance + input.amount
      }).value;

      // Salva as contas atualizadas
      const savedSourceAccount = await this._gateway.updateAccount(updatedSourceAccount);
      const savedTargetAccount = await this._gateway.updateAccount(updatedTargetAccount);

      this._gateway.logInfo('TransferAccount completed successfully', {
        outputTxt: JSON.stringify({ sourceAccount: savedSourceAccount, targetAccount: savedTargetAccount })
      });

      return this._presenter.show({
        success: true,
        data: {
          sourceAccount: savedSourceAccount,
          targetAccount: savedTargetAccount
        }
      });
    } catch (err: any) {
      this._gateway.logError('TransferAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: TransferAccountInput) {
    if (!input?.sourceIdentifier) {
      throw new Errors.MissingParam('sourceIdentifier');
    }

    if (!input?.targetIdentifier) {
      throw new Errors.MissingParam('targetIdentifier');
    }

    if (input.amount === undefined || input.amount === null) {
      throw new Errors.MissingParam('amount');
    }

    if (input.amount <= 0) {
      throw new Errors.InvalidParam('amount must be greater than zero');
    }

    if (input.sourceIdentifier === input.targetIdentifier) {
      throw new Errors.InvalidParam('source and target accounts must be different');
    }
  }
}
