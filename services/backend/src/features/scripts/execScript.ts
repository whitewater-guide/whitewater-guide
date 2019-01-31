import log from '@log';
import axios from 'axios';
import { WORKERS_ENDPOINT } from './endpoint';
import { ScriptPayload, ScriptResponse } from './types';

export const execScript = async <R>(
  payload: ScriptPayload,
): Promise<ScriptResponse<R>> => {
  try {
    const { data } = await axios.post<ScriptResponse<R>>(
      WORKERS_ENDPOINT,
      payload,
    );
    return data;
  } catch (error) {
    log.error(error);
    throw error;
  }
};