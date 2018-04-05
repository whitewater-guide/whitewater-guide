import React from 'react';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export class ClickBlocker extends React.PureComponent<Props> {
  stopPropagation = (event: React.SyntheticEvent<any>) => event.stopPropagation();

  render() {
    return (
      <div {...this.props} onClick={this.stopPropagation} />
    );
  }
}
