import { createBreadcrumb } from '../../components';
import { GAUGE_NAME } from '../../ww-clients/features/gauges';

export default createBreadcrumb({ query: GAUGE_NAME, resourceType: 'gauge' });
