import { createBreadcrumb } from '../../components';
import { SOURCE_NAME } from '../../ww-clients/features/sources';

export default createBreadcrumb({ query: SOURCE_NAME, resourceType: 'source' });
