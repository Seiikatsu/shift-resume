import { DateTime } from 'luxon';

const DATE_FORMAT = 'yyyy-MM-dd';

export const anyToDate = (date: unknown): Date | undefined => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === 'string' && date.trim().length > 0) {
    return DateTime.fromFormat(date, DATE_FORMAT).toJSDate();
  }
};

export const dateToIso8601 = (date: unknown): string | undefined => {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date).toFormat(DATE_FORMAT);
  }

  if (typeof date === 'string' && date.trim().length > 0) {
    if (DateTime.fromFormat(date, DATE_FORMAT).isValid) {
      return date;
    }
  }

  return undefined;
};
