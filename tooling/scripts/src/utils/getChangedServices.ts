import { getAllServices } from './getAllServices';
import { hasPackageChanged } from './hasPackageChanged';

/**
 * This function gets list of docker services that should be published
 */
export const getChangedServices = async () => {
  const result: string[] = [];
  const services = getAllServices();
  for (const service of services) {
    const changed = await hasPackageChanged(`services/${service}`);
    if (changed) {
      result.push(service);
    }
  }
  return result;
};
