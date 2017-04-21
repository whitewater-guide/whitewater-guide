import React from 'react';
import { Tabs as MUITabs } from 'material-ui/Tabs';
import { withRouter } from 'react-router';
import { TabTemplate } from './TabTemplate';

const styles = {
  tabs: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tabsContent: {
    flex: 1,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
  },
};

class Tabs extends React.Component {

  onTabChange = (value) => {
    const { location, history } = this.props;
    history.replace({ ...location, hash: value });
  };

  render() {
    const { children, match, history, staticContext, location, ...props } = this.props;
    return (
      <MUITabs
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
        tabTemplate={TabTemplate}
        {...props}
        value={location.hash || '#main'}
        onChange={this.onTabChange}
      >
        { children }
      </MUITabs>
    );
  }
}

export default withRouter(Tabs);
