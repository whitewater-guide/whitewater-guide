import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { Styles } from '../../styles';
import { Tag, TagInput } from '../../ww-commons';
import { WithTagMutations } from './types';

const styles: Styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

interface Props extends WithTagMutations {
  tag: Tag;
}

class TagForm extends React.PureComponent<Props, TagInput> {
  constructor(props: Props) {
    super(props);
    const { __typename, language, ...tag } = props.tag;
    this.state = { ...tag };
  }

  onIdChange = (e: any, id: string) => this.setState({ id });
  onNameChange = (e: any, name: string) => this.setState({ name });

  onSave = () => this.props.upsertTag(this.state, this.props.tag.language);
  onDelete = () => this.props.removeTag(this.props.tag.id);

  render() {
    const { id, name } = this.state;
    return (
      <div style={styles.row}>
        <TextField fullWidth value={id} floatingLabelText="id" hintText="id" onChange={this.onIdChange} />
        <TextField fullWidth value={name} floatingLabelText="Name" hintText="Name" onChange={this.onNameChange} />
        <IconButton
          iconClassName="material-icons"
          onClick={this.onSave}
          disabled={this.props.tag.id === this.state.id && this.props.tag.name === this.state.name}
        >
          {this.props.tag.id ? 'save' : 'add'}
        </IconButton>
        <IconButton iconClassName="material-icons" onClick={this.onDelete} disabled={!this.props.tag.id}>
          delete_forever
        </IconButton>
      </div>
    );
  }
}

export default TagForm;
