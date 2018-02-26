import { disconnect } from './db-helpers';

disconnect()
  .then(() => console.log('Posttest done'))
  .catch(() => console.log('Posttest failed'));
