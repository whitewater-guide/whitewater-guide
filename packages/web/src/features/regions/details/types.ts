import { RouteComponentProps } from 'react-router-dom';
import { WithRegion } from '../../../ww-clients/features/regions';
import { WithSectionsList } from '../../../ww-clients/features/sections';

export type RegionDetailsProps = WithRegion & WithSectionsList & RouteComponentProps<any>;
