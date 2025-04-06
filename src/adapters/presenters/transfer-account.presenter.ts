import { OutputPort, TransferAccountOutput } from '@useCases';

export class TransferAccountPresenter implements OutputPort<TransferAccountOutput> {
  private _response: TransferAccountOutput | null = null;

  public show(response: TransferAccountOutput): TransferAccountOutput {
    this._response = response;
    return response;
  }

  public getResponse(): TransferAccountOutput | null {
    return this._response;
  }
}
