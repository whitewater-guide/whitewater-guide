const omitTypenameReviver = (key: string, value: any) =>
  key === '__typename' ? undefined : value;

export const omitTypename = <T>(data: T): T =>
  data ? JSON.parse(JSON.stringify(data), omitTypenameReviver) : data;
