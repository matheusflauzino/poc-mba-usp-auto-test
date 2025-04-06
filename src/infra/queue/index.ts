export type QueueMessage = {
  eventType: EventTypes;
  data?: any;
  receiptHandle?: string;
  [extra: string]: any;
};

export enum EventTypes {
  ProcessSimulator = 'process_simulator',
}

export const ValidEventTypes = Object.values(EventTypes);

export * from './poller';
