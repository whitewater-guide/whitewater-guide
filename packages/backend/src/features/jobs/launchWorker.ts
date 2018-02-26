// import * as cp from 'child_process';
// import * as path from 'path';
//
// export interface GaugeWorkerOptions {
//   lastTimestamp?: number;
//   requestParams?: object;
// }
//
// export interface WorkerOptions {
//   code?: string;
//   lastTimestamp?: number;
//   requestParams?: object;
// }
//
// export const sourceWorker = (script: string) => worker({}, script);
//
// export const gaugeWorker = (script: string, code: string, options: GaugeWorkerOptions = {}) =>
//   worker({ ...options, code }, script);
//
// export const worker = (options: any, script: string) => new Promise((resolve, reject) => {
//   const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
//   const child = cp.fork(file, ['harvest'], { execArgv: [] });
//   let response: any;
//
//   child.on('close', (code) => {
//     if (code === 0) {
//       resolve(response);
//     } else {
//       reject(response);
//     }
//   });
//
//   child.on('message', (data) => {
//     response = data;
//   });
//
//   // This will actually start the worker script
//   child.send(options);
// });
