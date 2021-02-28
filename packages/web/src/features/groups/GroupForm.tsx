import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { Group, GroupInput, Overwrite } from '@whitewater-guide/commons';
import React from 'react';
import { Link } from 'react-router-dom';

type State = Overwrite<Group, { id: string | null }>;

interface Props {
  group: State;
  onAdd: (group: GroupInput) => void;
  onRemove: (id: string) => void;
}

class GroupForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = props.group;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const nextGroup = nextProps.group;
    if (nextGroup.id !== this.state.id || nextGroup.name !== this.state.name) {
      this.setState({ ...nextGroup });
    }
  }

  onNameChange = (e: any) => this.setState({ name: e.target.value });
  onSkuChange = (e: any) => this.setState({ sku: e.target.value || null });

  onSave = () => {
    const { id, name, sku } = this.state;
    this.props.onAdd({ id, name, sku });
  };

  onDelete = () => {
    if (this.props.group.id) {
      this.props.onRemove(this.props.group.id);
    }
  };

  renderRegions = () => {
    const { regions } = this.props.group;
    const nodes = regions?.nodes ?? [];
    return (
      <div style={{ flex: 1 }}>
        {nodes.map((r, i) => (
          <React.Fragment key={r.id}>
            <Link to={`/regions/${r.id}`}>{r.name}</Link>
            {i < nodes.length - 1 && ', '}
          </React.Fragment>
        ))}
      </div>
    );
  };

  render() {
    const { name, sku } = this.state;
    const saveDisabled =
      this.props.group.id === this.state.id &&
      this.props.group.name === this.state.name &&
      this.props.group.sku === this.state.sku;
    return (
      <TableRow>
        <TableCell style={{ minWidth: 200 }}>
          <TextField
            fullWidth={true}
            value={name}
            label="Name"
            placeholder="Name"
            onChange={this.onNameChange}
          />
        </TableCell>
        <TableCell style={{ minWidth: 200 }}>
          <TextField
            fullWidth={true}
            value={sku || ''}
            label="SKU"
            placeholder="SKU"
            onChange={this.onSkuChange}
          />
        </TableCell>
        <TableCell>{this.renderRegions()}</TableCell>
        <TableCell style={{ width: 150 }}>
          <IconButton onClick={this.onSave} disabled={saveDisabled}>
            <Icon>{this.props.group.id ? 'save' : 'add'}</Icon>
          </IconButton>
          <IconButton onClick={this.onDelete} disabled={!this.props.group.id}>
            <Icon>delete_forever</Icon>
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
}

export default GroupForm;
