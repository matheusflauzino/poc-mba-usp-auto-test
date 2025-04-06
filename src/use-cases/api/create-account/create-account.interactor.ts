import { Account } from '@entities';
import { CreateAccountInjections, CreateAccountGateway, CreateAccountOutput } from '.';
import { CreateAccountInput, InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors, Utils } from '@shared';

export default class CreateAccountInteractor extends InteractorValidatable {
  private readonly _gateway: CreateAccountGateway;
  private readonly _presenter: OutputPort<CreateAccountOutput>;

  constructor(params: CreateAccountInjections) {
    super();
    this._gateway = params.createAccountGateway;
    this._presenter = params.createAccountPresenter;
  }

  public async execute(input: CreateAccountInput) {
    this._gateway.logInfo('CreateAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      const { name, email, document } = input;

      const account = Account.build({
        identifier: Utils.generateUUID(),
        name,
        email,
        document,
        balance: 0, // Saldo inicial zero
      }).value;

      this._gateway.logInfo('CreateAccount completed successfully', { outputTxt: JSON.stringify(account) });
      return this._presenter.show({ success: true, data: { account } });
    } catch (err: any) {
      this._gateway.logError('CreateAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: CreateAccountInput) {
    if (!input?.name) {
      throw new Errors.MissingParam('name');
    }
    if (!input?.email) {
      throw new Errors.MissingParam('email');
    }
    if (!input?.document) {
      throw new Errors.MissingParam('document');
    }
  }
}
