import { TopLevelResolver, UnknownError } from '@apollo';
import { execScript } from '../execScript';
import { ScriptCommand, ScriptDescription } from '../types';

const scripts: TopLevelResolver = async () => {
  const { success, data, error } = await execScript<ScriptDescription[]>({
    command: ScriptCommand.LIST,
  });
  if (!success) {
    throw new UnknownError(`Failed to list workers: ${error}`);
  }
  return data!.map(({ name, mode }) => ({
    id: name,
    name,
    harvestMode: mode,
    error: null,
  }));
};

export default scripts;
