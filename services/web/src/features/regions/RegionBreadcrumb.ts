import { REGION_NAME } from '@whitewater-guide/clients';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({ query: REGION_NAME, resourceType: 'region' });
