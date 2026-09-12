export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function subDays(date: Date, amount: number): Date {
  return addDays(date, -amount);
}

export function subHours(date: Date, amount: number): Date {
  return new Date(date.getTime() - amount * 3_600_000);
}

export function differenceInDays(later: Date, earlier: Date): number {
  const ms = startOfDay(later).getTime() - startOfDay(earlier).getTime();
  return Math.round(ms / 86_400_000);
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatHoursMinutes(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTimeLabel(timestampMs: number, days: number): string {
  const date = new Date(timestampMs);
  if (days <= 1) return formatHoursMinutes(date);
  if (days <= 3) {
    return date.getHours() === 0 ? formatDayMonth(date) : formatHoursMinutes(date);
  }
  return formatDayMonth(date);
}

export interface FormatDistanceToNowOptions {
  addSuffix?: boolean;
}

export function formatDistanceToNow(
  date: Date,
  options: FormatDistanceToNowOptions = {},
): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const abs = Math.abs(seconds);
  let value: number;
  let unit: string;
  if (abs < 60) {
    value = abs;
    unit = value === 1 ? 'second' : 'seconds';
  } else if (abs < 3600) {
    value = Math.round(abs / 60);
    unit = value === 1 ? 'minute' : 'minutes';
  } else if (abs < 86_400) {
    value = Math.round(abs / 3600);
    unit = value === 1 ? 'hour' : 'hours';
  } else {
    value = Math.round(abs / 86_400);
    unit = value === 1 ? 'day' : 'days';
  }
  const phrase = `${value} ${unit}`;
  if (!options.addSuffix) return phrase;
  return seconds >= 0 ? `${phrase} ago` : `in ${phrase}`;
}
