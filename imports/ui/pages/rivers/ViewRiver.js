import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Rivers } from '../../../api/rivers';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import withAdmin from "../../hoc/withAdmin";
import {withRouter} from "react-router";

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
  chartHolder: {
    display: 'flex',
    flex: 1,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
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