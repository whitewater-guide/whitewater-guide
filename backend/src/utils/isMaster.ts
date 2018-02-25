import * as cluster from 'cluster';

export const isMaster = () => {
  if (process.env && process.env.pm_id) {
    // PM2 flag
    return parseInt(process.env.NODE_APP_INSTANCE!, 10) === 0;
  }
  return cluster.isMaster;
};
