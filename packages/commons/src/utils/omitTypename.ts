const omitTypenameReviver = (key: string, value: any) =>
  key === '__typename' ? undefined : value;

export const omitTypename = (data: object): object =>
  data ? JSON.parse(JSON.stringify(data), omitTypenameReviver) : data;
