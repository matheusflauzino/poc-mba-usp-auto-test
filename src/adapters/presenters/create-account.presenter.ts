import { OutputPort, CreateAccountOutput } from '@useCases';

export class CreateAccountPresenter implements OutputPort<CreateAccountOutput> {
  private _response: CreateAccountOutput | null = null;

  public show(response: CreateAccountOutput): CreateAccountOutput {
    this._response = response;
    return response;
  }

  public getResponse(): CreateAccountOutput | null {
    return this._response;
  }
}
