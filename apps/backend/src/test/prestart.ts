import { prepareMinio } from './minio';

prepareMinio()
  .then(() => {
    console.info('Prestart done');
    process.exit(0);
  })
  .catch((err) => {
    console.info('Prestart failed', err);
    process.exit(1);
  });
