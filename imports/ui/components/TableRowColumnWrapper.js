import React from 'react';
import {TableRowColumn} from 'material-ui/Table';

const TableRowColumnWrapper = React.createClass({

    render() {
        return (
            <TableRowColumn style={this.props.style} onCellClick={this.props.onCellClick}>
                {this.props.children}
            </TableRowColumn>
        );
    }
});

export default TableRowColumnWrapper;