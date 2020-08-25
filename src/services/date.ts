import { DateTime } from 'luxon';

export function isPast(date: DateTime): boolean {
  return date < DateTime.utc();
}
