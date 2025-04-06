import { DepositAccountOutput, OutputPort } from '@useCases';
import { logger } from '@shared';

export class DepositAccountPresenter implements OutputPort<DepositAccountOutput> {
  show(output: DepositAccountOutput): DepositAccountOutput {
    if (output.success) {
      logger.info('Deposit account presenter: success', { output });
    } else {
      logger.error('Deposit account presenter: failure', { output });
    }
    return output;
  }
}
