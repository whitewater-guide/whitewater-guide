import {listScripts} from './methods';

export const scriptsResolvers = {
  Query: {
    scripts: () => listScripts(),
  }
};