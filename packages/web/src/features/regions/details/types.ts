import { RouteComponentProps } from 'react-router-dom';
import { WithRegion, WithSearchTerms } from '../../../ww-clients/features/regions';
import { WithSectionsList } from '../../../ww-clients/features/sections';

export type RegionDetailsProps =
  WithRegion &
  WithSectionsList &
  WithSearchTerms &
  RouteComponentProps<any>;
