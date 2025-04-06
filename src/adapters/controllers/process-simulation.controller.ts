import { ProcessSimulationInteractor } from '@useCases';

export default class ProcessSimulationController {
  private interactor: ProcessSimulationInteractor;

  constructor(params: { processCardDataInteractor: ProcessSimulationInteractor }) {
    this.interactor = params.processCardDataInteractor;
  }

  async run(input: any): Promise<void> {
    await this.interactor.execute({ simulation: input.data });
  }
}
