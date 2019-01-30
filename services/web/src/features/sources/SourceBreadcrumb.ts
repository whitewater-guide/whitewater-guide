import { SOURCE_NAME } from '@whitewater-guide/clients';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({ query: SOURCE_NAME, resourceType: 'source' });
