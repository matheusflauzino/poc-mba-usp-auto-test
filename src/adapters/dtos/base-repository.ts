/* eslint-disable @typescript-eslint/no-unused-vars */
export class BaseRepository {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  constructor(...args: any[]) {}
}

export interface DataMapper {
  find(criteria: any, attributes?: any): Promise<any>;
}
