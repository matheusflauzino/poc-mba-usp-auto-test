import { GetAccountOutput } from '@useCases/api/get-account';
import { OutputPort } from '@useCases';

export class GetAccountPresenter implements OutputPort<GetAccountOutput> {
  show(output: GetAccountOutput): GetAccountOutput {
    if (output.success) {
      console.log('Account found:', output.data?.account);
    } else {
      console.error('Error finding account:', output.failure?.data);
    }
    return output;
  }
}
