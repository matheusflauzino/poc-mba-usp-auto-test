import { ProcessSimulationInjections, ProcessSimulationGateway, ProcessSimulationInput } from '.';
import { InteractorValidatable } from '@useCases';
import { Errors } from '@shared';
import {
  Simulation
} from '@entities';

export default class ProcessSimulationInteractor extends InteractorValidatable {
  private readonly _gateway: ProcessSimulationGateway;

  constructor(params: ProcessSimulationInjections) {
    super();
    this._gateway = params.processSimulationGateway;
  }

  public async execute(input: ProcessSimulationInput) {
    this._gateway.logInfo('ProcessSimulation request received');

    try {
      this.validateInput(input);
      const simulation = Simulation.build({
        principal: 0,
        annualInterestRate: 0,
        months: 0
      }).value

      await this._gateway.saveSimulation(simulation);


      //TODO: SALVE EM DYNAMO
      //SEND NOTIFICATION EMAIL


      this._gateway.logInfo('Successfully process simulation data');
    } catch (err: any) {
      this._gateway.logError('ProcessSimulation error', {
        exception: err
      });
      throw err;
    }
  }



  protected override validateInput(input: ProcessSimulationInput) {
    if (input?.simulation?.length === 0) {
      throw new Errors.ApplicationError('simulation');
    }
  }
}
