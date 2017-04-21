import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { AutoSizer} from 'react-virtualized';
import { SectionsTable } from '../sections';
import container from './ViewRiverContainer';

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

class ViewRiver extends Component {
  static propTypes = {
    river: PropTypes.object,
    loading: PropTypes.bool,
    admin: PropTypes.bool,
    history: PropTypes.object,
  };


  onEditSection = sectionId => this.props.history.push(`/sections/${sectionId}/settings`);
  onSectionClick = sectionId => this.props.history.push(`/sections/${sectionId}`);

  render() {
    const { river, loading, admin } = this.props;
    if (!river && loading)
      return null;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h2>{river.name}</h2>
            <p>{river.description}</p>
            <h3>Sections</h3>
            <AutoSizer>
              {({ width, height }) => (
                <SectionsTable
                  admin={admin}
                  sections={river.sections}
                  width={width}
                  height={height}
                  onEditSection={this.onEditSection}
                  onSectionClick={this.onSectionClick}
                />
              )}
            </AutoSizer>

          </Paper>
        </div>
      </div>
    );
  }

}

export default container(ViewRiver);
