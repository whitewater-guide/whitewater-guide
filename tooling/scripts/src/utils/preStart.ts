import { spawnSync } from 'child_process';
import { ensureDirSync } from 'fs-extra';
import rimraf from 'rimraf';

export const preStart = () => {
  ensureDirSync('./dev-mount/minio/data');
  ensureDirSync('./dev-mount/minio/config');
  ensureDirSync('./dev-mount/minio/log');
  ensureDirSync('./dev-mount/gorge/cache');
  ensureDirSync('./dev-mount/gorge/cookies');
  ensureDirSync('./dev-mount/imagecache');
  try {
    rimraf.sync('./dev-mount/minio/log/minio.log');
  } catch {}

  // empty the pgdata volume
  spawnSync('docker volume rm config_ww-db-pgdata');
  spawnSync('docker volume create config_ww-db-pgdata');
};
