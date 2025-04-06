import { MixLogService, MixMessageService } from '@adapters/services';
import { BaseRepository } from '@adapters/dtos';
import { MixSimulationRepository } from '@adapters/repositories';

const CreatePolicyGateway = MixMessageService(MixSimulationRepository(
  MixLogService(BaseRepository)
));

export default CreatePolicyGateway;
