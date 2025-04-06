import { OutputPort, CloseAccountOutput } from '@useCases';

export class CloseAccountPresenter implements OutputPort<CloseAccountOutput> {
  show(output: CloseAccountOutput): CloseAccountOutput {
    if (output.success) {
      console.log('Account closed successfully');
    } else {
      console.error('Error closing account:', output.failure?.data);
    }
    return output;
  }
}
