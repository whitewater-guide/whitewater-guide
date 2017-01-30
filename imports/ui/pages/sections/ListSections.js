import React, {Component, PropTypes} from 'react';
import withPagination from "../../hoc/withPagination";
import {SortDirection} from 'react-virtualized';
import {Counts} from 'meteor/tmeasday:publish-counts';
import PaginationContainer from '../../components/PaginationContainer';
import SectionsTable from './SectionsTable';
import {createContainer} from 'meteor/react-meteor-data';
import {Sections} from '../../../api/sections';
import {TAPi18n} from 'meteor/tap:i18n';
import {listQuery} from '../../../api/sections/query';

class ListSections extends Component {

  static propTypes = {
    limit: PropTypes.number,
    loadMore: PropTypes.func,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    onSort: PropTypes.func,
    ready: PropTypes.bool,
    sections: PropTypes.array,
    numSections: PropTypes.number,
  };

  render() {
    const {sections, limit, loadMore, ready, numSections} = this.props;
    return (
      <PaginationContainer style={styles.container} limit={limit} loading={!ready} loadMore={loadMore}
                           total={numSections}>
        <SectionsTable sections={sections} onSort={this.props.onSort} sortBy={this.props.sortBy} sortDirection={this.props.sortDirection}/>
      </PaginationContainer>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    minHeight: 200,
  },
  wrapper: {
    width: '100%',
    height: '100%',
  },
};

const ListGaugesContainer = createContainer(
  (props) => {
    const query = listQuery(props);
    const sub = TAPi18n.subscribe('sections.list', null, props);
    const sections = Sections.find(query.selector, query.options).fetch();
    const numSections = Counts.get(`counter.sections.current`);
    return {
      ready: sub.ready(),
      sections,
      numSections,
    };
  },
  ListSections
);

export default withPagination(25, 25)(ListGaugesContainer);