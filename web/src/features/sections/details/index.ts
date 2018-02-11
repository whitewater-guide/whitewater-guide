import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { withSection, WithSection } from '../../../ww-clients/features/sections';
import SectionDetails from './SectionDetails';

export default compose(
  withSection(),
  withLoading<WithSection>(props => props.section.loading),
)(SectionDetails);
