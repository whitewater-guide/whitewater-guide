import { HarvestMode } from '@whitewater-guide/commons';
import {
  ScriptCommand,
  ScriptDescription,
  ScriptPayload,
  ScriptResponse,
} from '../types';

export const execScript = async (
  payload: ScriptPayload,
): Promise<ScriptResponse<any>> => {
  switch (payload.command) {
    case ScriptCommand.LIST:
      const data: ScriptDescription[] = [
        { name: 'norway', mode: HarvestMode.ONE_BY_ONE },
        { name: 'galicia', mode: HarvestMode.ALL_AT_ONCE },
      ];
      return Promise.resolve({
        success: true,
        data,
      });
    case ScriptCommand.AUTOFILL:
      return Promise.resolve({
        success: true,
        error: 'autofill failed',
      });
    case ScriptCommand.HARVEST:
      return Promise.resolve({
        success: true,
        data: 20,
      });
  }
};
