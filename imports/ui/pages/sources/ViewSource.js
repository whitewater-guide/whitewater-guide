import React, {Component, PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import ListGauges from './ListGauges';
import { createContainer } from 'meteor/react-meteor-data';
import { Sources } from '../../../api/sources';

class ViewSource extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    source: PropTypes.object,
  };

  state = {
    currentTab: 'gauges',
  };

  render() {
    return (
      <div style={styles.container}>
        <Paper style={styles.tabBarHolder}>
          <Tabs value={this.state.currentTab} onChange={currentTab => this.setState({currentTab})} >
            <Tab label="Gauges"   value="gauges"/>
            <Tab label="Schedule" value="schedule"/>
            <Tab label="Settings" value="settings"/>
          </Tabs>
        </Paper>
        <Paper style={styles.contentHolder}>
          { this.renderContent() }
        </Paper>
      </div>
    );
  }

  renderContent = () => {
    switch (this.state.currentTab){
      case 'settings':
        return 'Settings';
      case 'gauges':
        return (<ListGauges source={this.props.source}/>);
      case 'schedule':
        return 'schedule';
      default:
        return null;
    }
  };
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

export default createContainer(
  ({params}) => {
    return { source: Sources.findOne(params.id) };
  },
  ViewSource
);