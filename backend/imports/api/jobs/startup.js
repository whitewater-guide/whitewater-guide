import {Sources} from '../sources';
import { startJobs } from './methods';

export function startJobsOnStartup() {
  Sources.find({ enabled: true }).forEach(source => startJobs(source))
}