import { TabsProps } from 'material-ui';
import { Tabs as MUITabs } from 'material-ui/Tabs';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Styles } from '../styles';
import { TabTemplate } from './TabTemplate';

const styles: Styles = {
  tabs: {
    height: '100%',
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

type Props = TabsProps & {
  fullPathMode?: boolean;
};

type InternalProps = Props & RouteComponentProps<any>;

class TabsInternal extends React.PureComponent<InternalProps> {

  onTabChange = (value: string) => {
    const { location, history, fullPathMode } = this.props;
    history.replace(fullPathMode ? { pathname: value } : { ...location, hash: value });
  };

  render() {
    const { children, match, history, fullPathMode, staticContext, location, ...props } = this.props;
    const value = fullPathMode ? location.pathname : (location.hash || '#main');
    return (
      <MUITabs
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
        tabTemplate={TabTemplate}
        {...props}
        value={value}
        onChange={this.onTabChange}
      >
        {children}
      </MUITabs>
    );
  }
}

export const Tabs = withRouter<Props>(TabsInternal);
