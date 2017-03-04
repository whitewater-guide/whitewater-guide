import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {ListSections} from '../sections';
import container from './ViewRiverContainer';

class ViewRiver extends Component {
  static propTypes = {
    river: PropTypes.object,
    loading: PropTypes.bool,
  };

  render() {
    const {river, loading} = this.props;
    if (!river && loading)
      return null;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h2>{river.name}</h2>
            <p>{river.description}</p>
            <h3>Sections</h3>
            <ListSections sections={river.sections} showFilters={false}/>
          </Paper>
        </div>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  headerPaper: {
    flex: 1,
    margin: 16,
    padding: 8,
  },
};

export default container(ViewRiver);