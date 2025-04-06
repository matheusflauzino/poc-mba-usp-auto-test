import { Simulation } from '@entities';
import { LoanSimulationInjections, LoanSimulationGateway, LoanSimulationOutput } from '.';
import { LoanSimulationsInput, InteractorValidatable } from '@useCases';

import { OutputPort } from '@useCases';
import { Errors, Utils } from '@shared';
import { MessagesBody } from '@adapters';
import { EventTypes } from '@infra';

export default class LoanSimulationInteractor extends InteractorValidatable {
  private readonly _gateway: LoanSimulationGateway;
  private readonly _presenter: OutputPort<LoanSimulationOutput>;

  constructor(params: LoanSimulationInjections) {
    super();
    this._gateway = params.loanSimulationGateway;
    this._presenter = params.loanSimulationPresenter;
  }

  public async execute(input: LoanSimulationsInput) {
    this._gateway.logInfo('LoanSimulation request received', {
      inputTxt: JSON.stringify(input)
    });

    try {

      this.validateInput(input);

      const { simulations } = input;

      const pendingSimulations: MessagesBody[] = [];


      const results = simulations.map((simulationInput) => {
        const { principal, birthDate, months } = simulationInput;

        const age = Utils.calculateAge(birthDate);
        const annualInterestRate = this.getAnnualInterestRate(age);

        const simulation = Simulation.build({
          identifier: Utils.generateUUID(),
          principal: principal * 100, //CONVERTE PARA CENTAVOS
          annualInterestRate,
          months,
        }).value;

        pendingSimulations.push({
          message: JSON.stringify({
            type: EventTypes.ProcessSimulator,
            simulation
          }),
          id: Utils.removeNonAlphanumeric(simulation.identifier!)
        });


        return simulation;
      });


      if (pendingSimulations.length > 0) {
        await this._gateway.sendBatchMessagesToOwnQueue(pendingSimulations);
        this._gateway.logInfo('Pending simulations batch sent to own queue', { outputTxt: JSON.stringify(results) });
      }


      this._gateway.logInfo('LoanSimulation completed successfully', { outputTxt: JSON.stringify(results) });
      return this._presenter.show({ success: true, data: { simulations: results } });
    } catch (err: any) {
      this._gateway.logError('LoanSimulation error', {
        exception: err
      });
      return this._presenter.show({ success: false, failure: { data: err } });
    }
  }

  protected override validateInput(input: LoanSimulationsInput) {
    if (!input?.simulations?.length) {
      throw new Errors.MissingParam('simulations');
    }
  }

  private getAnnualInterestRate(age: number): number {
    if (age <= 25) return 5;
    if (age <= 40) return 3;
    if (age <= 60) return 2;
    return 4;
  }

}
