import { withSection, WithSection } from '@whitewater-guide/clients';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import SectionDetails from './SectionDetails';

export default compose<WithSection & RouteComponentProps<any>, {}>(
  withSection(),
  withLoading<WithSection>((props) => props.section.loading),
)(SectionDetails);
