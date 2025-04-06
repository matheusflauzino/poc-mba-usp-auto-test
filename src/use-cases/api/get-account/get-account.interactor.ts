import { GetAccountInjections, GetAccountInput, GetAccountOutput } from '.';
import { InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors } from '@shared';
import { GetAccountGateway } from './get-account.gateway';

export default class GetAccountInteractor extends InteractorValidatable {
  private readonly _gateway: GetAccountGateway;
  private readonly _presenter: OutputPort<GetAccountOutput>;

  constructor(params: GetAccountInjections) {
    super();
    this._gateway = params.getAccountGateway;
    this._presenter = params.getAccountPresenter;
  }

  public async execute(input: GetAccountInput): Promise<GetAccountOutput> {
    this._gateway.logInfo('GetAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      const account = await this._gateway.findAccountByIdentifier(input.identifier);

      if (!account) {
        throw new Errors.NotFoundError('Account not found');
      }

      if (!account.identifier) {
        throw new Errors.MissingParam('account.identifier');
      }

      this._gateway.logInfo('GetAccount completed successfully', { outputTxt: JSON.stringify(account) });
      return this._presenter.show({ success: true, data: { account } });
    } catch (err: any) {
      this._gateway.logError('GetAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: GetAccountInput) {
    if (!input?.identifier) {
      throw new Errors.MissingParam('identifier');
    }
  }
}
