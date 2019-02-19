import { Group, Region } from '@whitewater-guide/commons';
import get from 'lodash/get';
import IconButton from 'material-ui/IconButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import React from 'react';
import { Link } from 'react-router-dom';
import { Overwrite } from 'type-zoo';
import { WithGroupMutations } from './types';

type State = Overwrite<Group, { id: string | null }>;

interface Props extends WithGroupMutations {
  group: State;
}

class GroupForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = props.group;
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextGroup = nextProps.group;
    if (nextGroup.id !== this.state.id || nextGroup.name !== this.state.name) {
      this.setState({ ...nextGroup });
    }
  }

  onNameChange = (e: any, name: string) => this.setState({ name });
  onSkuChange = (e: any, sku: string) => this.setState({ sku: sku || null });

  onSave = () => {
    const { id, name, sku } = this.state;
    this.props.upsertGroup({ id, name, sku });
  };

  onDelete = () => this.props.removeGroup(this.props.group.id!);

  renderRegions = () => {
    const { regions } = this.props.group;
    const nodes: Region[] = get(regions, 'nodes', [])!;
    return (
      <div style={{ flex: 1 }}>
        <ul>
          {nodes.map((r) => (
            <li>
              <Link key={r.id} to={`/regions/${r.id}`}>
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
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
        <TableRowColumn>
          <TextField
            fullWidth={true}
            value={name}
            hintText="Name"
            onChange={this.onNameChange}
          />
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            fullWidth={true}
            value={sku || ''}
            hintText="SKU"
            onChange={this.onSkuChange}
          />
        </TableRowColumn>
        <TableRowColumn>{this.renderRegions()}</TableRowColumn>
        <TableRowColumn style={{ width: 150 }}>
          <IconButton
            iconClassName="material-icons"
            onClick={this.onSave}
            disabled={saveDisabled}
          >
            {this.props.group.id ? 'save' : 'add'}
          </IconButton>
          <IconButton
            iconClassName="material-icons"
            onClick={this.onDelete}
            disabled={!this.props.group.id}
          >
            delete_forever
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default GroupForm;
