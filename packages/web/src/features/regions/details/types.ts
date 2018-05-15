import { RouteComponentProps } from 'react-router-dom';
import { RegionContext, WithRegion } from '../../../ww-clients/features/regions';
import { WithSectionsList } from '../../../ww-clients/features/sections';

export type RegionDetailsProps =
  WithRegion &
  WithSectionsList &
  Pick<RegionContext, 'searchTerms'> &
  RouteComponentProps<any>;
