import { LoanSimulationOutput, OutputPort } from '@useCases';
import { Errors } from '@shared';


type LoanSimulationView = {
  statusCode: number;
  headers?: any;
  body?: any;
};

export default class LoanSimulationPresenter implements OutputPort<LoanSimulationOutput> {
  private _view: LoanSimulationView;

  get view(): LoanSimulationView {
    return this._view;
  }

  public show(response: LoanSimulationOutput) {
    if (response.success && response.data) {
      this._view = {
        statusCode: 200,
        body: {
          simulations: response.data.simulations.map((item) => ({
            monthlyPayment: item.result.monthlyPayment / 100,
            totalInterest: item.result.totalInterest / 100,
            totalPayment: item.result.totalPayment / 100,
          }))
        }
      };
      return;
    }

    if (response.failure) {
      this._view = {
        statusCode: Errors.getStatusCodeFromError(response.failure.data),
        body: Errors.formatErrorResponse(response.failure.data)
      };
    }
  }
}
