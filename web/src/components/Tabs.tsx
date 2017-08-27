import { TabsProps } from 'material-ui';
import { Tabs as MUITabs } from 'material-ui/Tabs';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Styles } from '../styles';
import { TabTemplate } from './TabTemplate';

const styles: Styles = {
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

class TabsInternal extends React.PureComponent<TabsProps & RouteComponentProps<any>> {

  onTabChange = (value: string) => {
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
        {children}
      </MUITabs>
    );
  }
}

export const Tabs = withRouter<TabsProps>(TabsInternal);
