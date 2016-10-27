import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Rivers } from '../../../api/rivers';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import withAdmin from "../../hoc/withAdmin";
import {withRouter} from "react-router";
import ListSections from './ListSections';

class ViewRiver extends Component {
  static propTypes = {
    params: PropTypes.shape({
      riverId: PropTypes.string,
    }),
    river: PropTypes.object,
    ready: PropTypes.bool,
    admin: PropTypes.bool,
    router: PropTypes.object,
  };

  render() {
    if (!this.props.ready)
      return null;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h1>{this.props.river.name}</h1>
            <p>{this.props.river.description}</p>
            <h2>Sections</h2>
            <ListSections sections={this.props.river.sections()}/>
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
    margin: 16,
    padding: 8,
  },
};

const ViewRiverContainer = createContainer(
  (props) => {
    const sub = Meteor.subscribe('rivers.details', props.params.riverId);
    const river = Rivers.findOne(props.params.riverId);
    return {
      ready: sub.ready(),
      river,
    };
  },
  ViewRiver
);

export default withRouter(withAdmin(ViewRiverContainer));