import { spawnSync } from 'child_process';
import { dockerLogin } from './dockerLogin';

/**
 * @param images, long format, e.g. 957200854505.dkr.ecr.eu-central-1.amazonaws.com/ww/web:staging
 * @param containers optional, which particular images, short, e.g. 'web'
 */
export const pushImages = (images: string[], containers?: string[]) => {
  let imagez = images;
  if (containers && containers.length > 0) {
    imagez = images.filter((img) =>
      containers.some((container) => img.indexOf(container) >= 0),
    );
  }
  dockerLogin();
  imagez.forEach((image) => {
    spawnSync('docker', ['push', image], { stdio: 'inherit' });
  });
};
