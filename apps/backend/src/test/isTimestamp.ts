export const TIMESTAMP_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z/;

export const isTimestamp = (s: string) => TIMESTAMP_REGEX.test(s);
