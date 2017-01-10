import React, {Component, PropTypes} from 'react';
import withPagination from "../../hoc/withPagination";
import {Counts} from 'meteor/tmeasday:publish-counts';
import PaginationContainer from '../../components/PaginationContainer';
import SectionsTable from './SectionsTable';
import {createContainer} from 'meteor/react-meteor-data';
import {Sections} from '../../../api/sections';
import {TAPi18n} from 'meteor/tap:i18n';

class ListSections extends Component {

  static propTypes = {
    limit: PropTypes.number,
    loadMore: PropTypes.func,
    ready: PropTypes.bool,
    sections: PropTypes.array,
    numSections: PropTypes.number,
  };

  render() {
    const {sections, limit, loadMore, ready, numSections} = this.props;
    return (
      <PaginationContainer style={styles.container} limit={limit} loading={!ready} loadMore={loadMore}
                           total={numSections}>
        <h1>List sections page stub</h1>
        <SectionsTable sections={sections} numSections={numSections}/>
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
};

const ListGaugesContainer = createContainer(
  (props) => {
    const sub = TAPi18n.subscribe('sections.list', null, {}, props.limit);
    const sections = Sections.find({}, {sort: {name: 1}}).fetch();
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