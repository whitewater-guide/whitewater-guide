import PropTypes from 'prop-types';
import React from 'react';
import * as moment from 'moment';
import FontIcon from 'material-ui/FontIcon';
import _ from 'lodash';
import { Column, Table } from 'react-virtualized';
import { GaugePropType } from '../../commons/features/gauges';
import { AdminControls, rowRenderer } from '../../core/components';

const styles = {
  statusIcon: {
    fontSize: 14,
  },
  warnIcon: {
    fontSize: 16,
  },
};

export default class GaugesTable extends React.PureComponent {
  static propTypes = {
    gauges: PropTypes.arrayOf(GaugePropType),
    admin: PropTypes.bool.isRequired,
    source: PropTypes.object,
    registerChild: PropTypes.func.isRequired,
    onEditGauge: PropTypes.func.isRequired,
    onDeleteGauge: PropTypes.func.isRequired,
    onToggleGauge: PropTypes.func.isRequired,
    onGaugeClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    gauges: [],
    source: {},
  };

  onRowClick = ({ index }) => this.props.onGaugeClick(this.props.gauges[index]._id);

  getFlow = ({ rowData }) => (rowData.lastFlow ? (_.round(rowData.lastFlow, 4) + ' ' + rowData.flowUnit) : '');
  getLevel = ({ rowData }) => (rowData.lastLevel ? (_.round(rowData.lastLevel, 4) + ' ' + rowData.levelUnit) : '');
  getParams = ({ rowData }) => rowData.requestParams && JSON.stringify(rowData.requestParams);
  renderUrl = ({ cellData }) => (<a href={cellData}>Link</a>);

  renderDate = ({ rowData }) => {
    const freshness = moment().diff(moment(rowData.lastTimestamp), 'days', true);
    return (
      <div>
        {rowData.lastTimestamp && moment(rowData.lastTimestamp).format('DD.MM.YYYY HH:mm')}
        {freshness > 1 && <FontIcon className="material-icons" color="red" style={styles.warnIcon}>warning</FontIcon>}
      </div>
    );
  };

  renderControls = ({ rowData: gauge }) => {
    const editHandler = () => this.props.onEditGauge(gauge._id);
    const deleteHandler = () => this.props.onDeleteGauge(gauge._id);
    const startStopHandler = () => this.props.onToggleGauge(gauge._id, !gauge.enabled);
    const stoppable = this.props.source.harvestMode === 'ONE_BY_ONE';
    return (
      <AdminControls
        toggleable={stoppable}
        isOn={gauge.enabled}
        onToggle={startStopHandler}
        onEdit={editHandler}
        onDelete={deleteHandler}
      />
    );
  };

  render() {
    const { admin, gauges, ...props } = this.props;
    return (
      <Table
        headerHeight={24}
        rowHeight={32}
        rowCount={gauges.length}
        rowGetter={({ index }) => gauges[index]}
        onRowClick={this.onRowClick}
        rowRenderer={rowRenderer}
        ref={this.props.registerChild}
        {...props}
      >
        <Column width={150} flexGrow={5} dataKey="name" label="Name" />
        {
          admin &&
          <Column width={10} flexGrow={1} dataKey="code" label="Code" />
        }
        <Column width={40} flexGrow={0} dataKey="url" label="URL" cellRenderer={this.renderUrl} />
        <Column width={10} flexGrow={2} dataKey="lastFlow" label="Flow" cellDataGetter={this.getFlow} />
        <Column width={10} flexGrow={2} dataKey="lastLevel" label="Level" cellDataGetter={this.getLevel} />
        <Column width={150} flexGrow={0} dataKey="lastTimestamp" label="Date" cellRenderer={this.renderDate} />
        {
          admin &&
          <Column width={90} flexGrow={2} dataKey="cron" label="Cron" />
        }
        {
          admin &&
          <Column width={100} flexGrow={1} dataKey="requestParams" label="Params" cellDataGetter={this.getParams} />
        }
        {
          admin &&
          <Column width={90} flexGrow={0} dataKey="controls" label="Controls" cellRenderer={this.renderControls} />
        }
      </Table>
    );
  }
}
