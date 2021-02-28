export const inflateError = (
  error?: string,
): { [key: string]: any } | undefined => {
  if (!error) {
    return undefined;
  }
  const parts = error.split('.');
  if (parts.length < 2) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const value = parts.pop()!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const field = parts.pop()!;
  return { [field]: value };
};
