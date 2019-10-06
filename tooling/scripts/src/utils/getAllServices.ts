import { readdirSync } from 'fs';
import { resolve } from 'path';

/**
 * This function gets list of all docker services that are ours
 */
export const getAllServices = () =>
  readdirSync(resolve(process.cwd(), 'services'));
