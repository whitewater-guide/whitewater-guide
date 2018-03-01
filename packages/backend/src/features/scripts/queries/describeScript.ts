import { HarvestMode } from '../../../ww-commons';
import { execScript } from '../execScript';
import { ScriptDescribeResponse, ScriptOperation } from '../types';

export const describeScript = async (script: string) => {
  try {
    const { name, mode }: ScriptDescribeResponse = await execScript(script, ScriptOperation.DESCRIBE);
    return { id: name, name, harvestMode: mode, error: null };
  } catch (err) {
    return {
      id: script,
      name: script,
      harvestMode: HarvestMode.ALL_AT_ONCE,
      error: err.message,
    };
  }
};
