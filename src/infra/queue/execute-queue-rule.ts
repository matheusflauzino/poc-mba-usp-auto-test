import { AwilixContainer } from 'awilix';

export default async function executeQueueRule(
  rule: string,
  container: AwilixContainer,
  messageObject: any
) {
  const controller: any = container.resolve(`${rule}Controller`);
  await controller.run(messageObject);
}
