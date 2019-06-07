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
  const value = parts.pop()!;
  const field = parts.pop()!;
  return { [field]: value };
};
