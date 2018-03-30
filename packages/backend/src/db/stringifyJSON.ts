const replacer = (key: string, value: any) => {
  if (typeof value === 'string') {
    return value.replace(/'/g, "''");
  }
  return value;
};

export const stringifyJSON = (json: object): string =>
  JSON.stringify(json, replacer);
