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
    content: PropTypes.element,
    leftPanel: PropTypes.element,
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
        <div style={styles.body}>
          <Paper style={styles.leftPanelPaper}>
              { this.props.leftPanel && React.cloneElement(this.props.leftPanel, {source: this.props.source}) }
          </Paper>
          <div style={styles.contentHolder}>
            <Paper style={styles.contentPaper}>
              { this.props.content && React.cloneElement(this.props.content, {source: this.props.source}) }
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  onTabChange = (tab) => {
    this.props.router.push(`/sources/${this.props.params.id}/${tab}`);
  };

}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  body: {
    display: 'flex',
    flex: 1,
  },
  tabBarHolder: {
    alignSelf: 'center',
    marginTop: 24,
    width: 450,
  },
  leftPanelPaper: {
    width: 200,
    minHeight: 120,
    margin: 24,
  },
  contentHolder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  contentPaper: {
    maxWidth: 1200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },
}

const ViewSourceContainer = createContainer(
  ({params}) => {
    return { source: Sources.findOne(params.id) };
  },
  ViewSource
);

export default withRouter(ViewSourceContainer);