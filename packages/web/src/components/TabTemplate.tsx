import React from 'react';

const styles = {
  tabTemplate: {
    minHeight: 0,
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
  },
};

interface Props {
  style?: React.CSSProperties;
  selected?: boolean;
}

export class TabTemplate extends React.Component<Props> {
  render() {
    const { children, selected, style } = this.props;
    const templateStyle: React.CSSProperties = { ...styles.tabTemplate, ...style } as any;
    templateStyle.display = selected ? 'flex' : 'none';
    templateStyle.overflow = selected ? 'auto' : 'hidden';
    return (
      <div style={templateStyle}>
        {children}
      </div>
    );
  }
}
