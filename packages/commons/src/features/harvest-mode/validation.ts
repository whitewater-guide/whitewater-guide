import { struct } from 'superstruct';
import { HarvestMode } from './types';

export const HarvestModeStruct = struct.enum([HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE])
