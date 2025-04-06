import { DepositAccountOutput, OutputPort } from '@useCases';

export class DepositAccountPresenter implements OutputPort<DepositAccountOutput> {
  show(output: DepositAccountOutput): DepositAccountOutput {
    if (output.success) {
      console.log('Deposit account presenter: success', { output });
    } else {
      console.error('Deposit account presenter: failure', { output });
    }
    return output;
  }
}
