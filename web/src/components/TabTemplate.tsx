import * as React from 'react';

const styles = {
  tabTemplate: {
    minHeight: 0,
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

interface Props {
  style?: React.CSSProperties;
  selected?: boolean;
}

export class TabTemplate extends React.PureComponent<Props> {
  render() {
    const { children, selected, style } = this.props;
    const templateStyle: React.CSSProperties = { ...styles.tabTemplate, style } as any;
    if (!selected) {
      templateStyle.flex = 0;
      templateStyle.overflow = 'hidden';
    }

    return (
      <div style={templateStyle}>
        {children}
      </div>
    );
  }
}
