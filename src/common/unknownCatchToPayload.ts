import {LogContext} from '@seiikatsu/logger/dist/logger';

export const unknownCatchToPayload = (e: unknown, msg: string): LogContext => {
  if (e instanceof Error) {
    return {
      msg,
      err: e,
    };
  }
  return {
    msg,
    payload: e,
  };
};
