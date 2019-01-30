import { GAUGE_NAME } from '@whitewater-guide/clients';
import { createBreadcrumb } from '../../components';

export default createBreadcrumb({ query: GAUGE_NAME, resourceType: 'gauge' });
