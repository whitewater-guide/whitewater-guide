import {
  chunkedListLoader,
  withRegion,
  withSectionsList,
} from '@whitewater-guide/clients';
import { compose } from 'recompose';
import { RegionDetailsProps } from './types';

export default compose<RegionDetailsProps, {}>(
  withRegion,
  withSectionsList(),
  chunkedListLoader('sections'),
);
