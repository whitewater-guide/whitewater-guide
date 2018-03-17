import axios from 'axios';
import { WORKERS_ENDPOINT } from './endpoint';
import { ScriptPayload, ScriptResponse } from './types';

export const execScript = async <R>(payload: ScriptPayload): Promise<ScriptResponse<R>> => {
  const { data } = await axios.post(WORKERS_ENDPOINT, payload);
  return data;
};
