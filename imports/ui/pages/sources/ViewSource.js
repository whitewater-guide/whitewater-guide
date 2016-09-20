import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { createContainer } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import { Sources } from '../../../api/sources';

class ViewSource extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    source: PropTypes.object,
    router: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const parts = this.props.location.pathname.split('/');
    const currentTab = parts.length > 3 ? parts[3] : 'gauges';
    return (
      <div style={styles.container}>
        <Paper style={styles.tabBarHolder}>
          <Tabs value={currentTab} onChange={this.onTabChange}>
            <Tab label="Gauges"   value="gauges"/>
            <Tab label="Schedule" value="schedule"/>
            <Tab label="Settings" value="settings"/>
          </Tabs>
        </Paper>
        <Paper style={styles.contentHolder}>
          { this.props.children && React.cloneElement(this.props.children, {source: this.props.source}) }
        </Paper>
      </div>
    );
  }

  onTabChange = (tab) => {
    this.props.router.push(`/sources/${this.props.params.id}/${tab}`);
  }

}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabBarHolder: {
    marginTop: 24,
    width: 450,
  },
  contentHolder: {
    display: 'flex',
    flex: 1,
    maxWidth: 1000,
    maxHeight: 600,
    marginTop: 24,
  },
}

const ViewSourceContainer = createContainer(
  ({params}) => {
    return { source: Sources.findOne(params.id) };
  },
  ViewSource
);

export default withRouter(ViewSourceContainer);