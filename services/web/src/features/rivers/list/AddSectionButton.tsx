import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';

interface Props {
  href: string;
  onAdd: (href: string) => void;
}

export default class AddSectionButton extends React.PureComponent<Props> {
  onClick = () => this.props.onAdd(this.props.href);

  render() {
    return (
      <FlatButton
        onClick={this.onClick}
        label="Add Section"
        icon={<FontIcon className="material-icons">add</FontIcon>}
      />
    );
  }
}
