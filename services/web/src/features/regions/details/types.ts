import { WithRegion, WithSectionsList } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';

export type RegionDetailsProps = WithRegion &
  WithSectionsList &
  RouteComponentProps<any>;
