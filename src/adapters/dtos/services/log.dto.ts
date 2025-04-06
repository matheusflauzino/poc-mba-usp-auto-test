import { HTTPRequest, HTTPResponse } from '../http-request';

export type LogData = {
  // Text objects
  inputTxt?: string;
  outputTxt?: string;

  // Lib
  uuid?: string;
  req?: HTTPRequest;
  res?: HTTPResponse;

  // Errors
  exception?: any;
  errorTxt?: string;
};

export interface ILogger {
  trace(message: string, data?: LogData): void;
  debug(message: string, data?: LogData): void;
  info(message: string, data?: LogData): void;
  warn(message: string, data?: LogData): void;
  error(message: string, data?: LogData): void;
  critical(message: string, data?: LogData): void;
  fatal(message: string, data?: LogData): void;
  addContext(dataObj: LogData): void;
  clearContext(): void;
}
