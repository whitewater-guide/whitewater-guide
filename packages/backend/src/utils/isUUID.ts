export const UUID_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export function isUUID(value: unknown): boolean {
  return typeof value === 'string' && UUID_REGEX.test(value);
}
