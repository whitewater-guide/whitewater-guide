import { createBreadcrumb } from '../../components';
import { RIVER_NAME } from '../../ww-clients/features/rivers';

export default createBreadcrumb({ query: RIVER_NAME, resourceType: 'river' });
