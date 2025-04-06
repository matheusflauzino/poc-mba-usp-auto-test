import { OutputPort, WithdrawAccountOutput } from '@useCases';

export class WithdrawAccountPresenter implements OutputPort<WithdrawAccountOutput> {
  private _response: WithdrawAccountOutput | null = null;

  public show(response: WithdrawAccountOutput): WithdrawAccountOutput {
    this._response = response;
    return response;
  }

  public getResponse(): WithdrawAccountOutput | null {
    return this._response;
  }
}
