export interface HTTPRequest {
  body?: any;
  params?: any;
  headers?: any;
  query?: any;
  protocol?: any;
  originalUrl?: any;
  ip?: any;
}

export interface HTTPResponse {
  locals?: any;
}
