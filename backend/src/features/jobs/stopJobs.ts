// import { cancelJob } from 'node-schedule';
//
// export function stopJobs(script: string, gaugeCode?: string) {
//   const jobId = gaugeCode ? `${script}::${gaugeCode}` : script;
//   cancelJob(jobId);
// }
export async function stopJobs(sourceId: string, gaugeId?: string) {
  console.log(`Stop jobs for ${sourceId}/${gaugeId}`);
}
