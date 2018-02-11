import { createBreadcrumb } from '../../components';
import { REGION_NAME } from '../../ww-clients/features/regions';

export default createBreadcrumb({ query: REGION_NAME, resourceType: 'region' });
