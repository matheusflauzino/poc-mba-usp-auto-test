import * as dotenv from 'dotenv';

type RequestOptions = {
  path?: string;
  method?: string;
  headers?: any;
  body?: any;
};

export default class Requester {
  private static _instance?: Requester = undefined;

  private url: string | undefined;


  private constructor() {
    dotenv.config({ path: `${__dirname}/.env` });

    this.url = process.env.API_URL;

    if (!this.url) {
      throw new Error('Please set env variable API_URL');
    }


  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Requester();
    }
    return this._instance;
  }

  public async fetch({ method = 'GET', headers, path, body }: RequestOptions) {



    const options: RequestInit = {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      method
    };

    const response = await fetch(`${this.url}${path}`, options);

    const { status } = response;
    const textResponse = await response.text();

    let responseBody: any;
    try {
      responseBody = JSON.parse(textResponse);
    } catch (err) {
      responseBody = { not_json_error: textResponse };
    }

    return { status, body: responseBody };
  }
}
