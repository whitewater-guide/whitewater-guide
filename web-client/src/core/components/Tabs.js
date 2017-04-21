import React from 'react';
import { Tabs as MUITabs } from 'material-ui/Tabs';
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

const Tabs = ({ children, ...props }) => (
  <MUITabs style={styles.tabs} contentContainerStyle={styles.tabsContent} tabTemplate={TabTemplate}>
    { children }
  </MUITabs>
);

export default Tabs;