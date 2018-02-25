import { WorkerMeasurement } from '../measurements';

export interface WorkerResponse {
  success: boolean;
  error?: string;
  data: WorkerMeasurement[];
}
