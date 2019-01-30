import { RIVER_NAME } from '@whitewater-guide/clients';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({ query: RIVER_NAME, resourceType: 'river' });
