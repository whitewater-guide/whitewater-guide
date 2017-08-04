import * as fs from 'fs';
import { upperFirst } from 'lodash';
import * as path from 'path';

export const loadGraphqlFile = (feature: string, file?: string): string => {
  const filename = file || upperFirst(feature);
  const filePath = path.resolve('src/features', feature, `${filename}.graphql`);
  return fs.readFileSync(filePath).toString();
};
