import { connect } from 'react-redux';
import { compose, lifecycle, mapProps, pure } from 'recompose';
import { RegionDetailsProps } from '../../../../web/src/features/regions/details/types';
import { NavigationScreenProps } from '../../../typings/react-navigation';
import { withLoading } from '../../components';
import { chunkedListLoader } from '../../ww-clients/apollo';
import { RegionContextValue, WithRegion, withRegion } from '../../ww-clients/features/regions';
import { searchTermsSelector, WithSearchTerms } from '../../ww-clients/features/regions/selectors';
import { WithSectionsList, withSectionsList } from '../../ww-clients/features/sections';
import { applySearch } from '../../ww-commons';

export default compose(
  withRegion,
  lifecycle<RegionContextValue & NavigationScreenProps, {}>({
    componentDidMount() {
      const { setRegionId, navigation } = this.props;
      setRegionId(navigation.getParam('regionId'));
    },
    componentWillUnmount() {
      this.props.setRegionId();
    },
  }),
  withLoading<WithRegion>((props) => props.region.loading),
  withSectionsList(),
  chunkedListLoader('sections'),
  connect<WithSearchTerms, {}, WithSectionsList>(searchTermsSelector),
  mapProps<RegionDetailsProps, RegionDetailsProps>(({ sections, searchTerms, ...props }) => ({
    ...props,
    searchTerms,
    sections: {
      ...sections,
      nodes: applySearch(sections.nodes, searchTerms),
    },
  })),
  pure,
);
