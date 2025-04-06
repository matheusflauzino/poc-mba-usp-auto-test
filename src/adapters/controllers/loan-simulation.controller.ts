import { LoanSimulationInteractor, LoanSimulationsInput } from '@useCases';
import { HTTPRequest, HTTPResponse } from '../dtos';

export default class LoanSimulationController {
  private interactor: LoanSimulationInteractor;

  constructor(params: { loanSimulationInteractor: LoanSimulationInteractor }) {
    this.interactor = params.loanSimulationInteractor;
  }

  async run(input: HTTPRequest, _: HTTPResponse) {
    const interactorInput: LoanSimulationsInput = {
      simulations: input.body?.simulations
    };
    await this.interactor.execute(interactorInput);
  }
}
