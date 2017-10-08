import { createBreadcrumb } from '../../components';
import { REGION_NAME } from '../../ww-clients/features/regions';

export default createBreadcrumb(REGION_NAME, 'region', 'regionId');
