import { CloseAccountInjections, CloseAccountInput, CloseAccountOutput } from '.';
import { InteractorValidatable } from '@useCases';
import { OutputPort } from '@useCases';
import { Errors } from '@shared';
import { CloseAccountGateway } from './close-account.gateway';

export default class CloseAccountInteractor extends InteractorValidatable {
  private readonly _gateway: CloseAccountGateway;
  private readonly _presenter: OutputPort<CloseAccountOutput>;

  constructor(params: CloseAccountInjections) {
    super();
    this._gateway = params.closeAccountGateway;
    this._presenter = params.closeAccountPresenter;
  }

  public async execute(input: CloseAccountInput): Promise<CloseAccountOutput> {
    this._gateway.logInfo('CloseAccount request received', {
      inputTxt: JSON.stringify(input)
    });

    try {
      this.validateInput(input);

      const account = await this._gateway.findAccountByIdentifier(input.identifier);

      if (!account) {
        throw new Errors.NotFoundError('Account not found');
      }

      await this._gateway.deleteAccount(input.identifier);

      this._gateway.logInfo('CloseAccount completed successfully', {
        outputTxt: JSON.stringify({ identifier: input.identifier })
      });

      return this._presenter.show({ success: true });
    } catch (err: any) {
      this._gateway.logError('CloseAccount error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: CloseAccountInput) {
    if (!input?.identifier) {
      throw new Errors.MissingParam('identifier');
    }
  }
}
