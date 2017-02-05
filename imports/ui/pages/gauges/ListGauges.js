import React, {PropTypes} from 'react';
import {Column, Table, AutoSizer, InfiniteLoader} from 'react-virtualized';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import container from './ListGaugesContainer';
import _ from 'lodash';
import moment from 'moment';

class ListGauges extends React.Component {
  static propTypes = {
    gauges: PropTypes.array.isRequired,
    jobsReport: PropTypes.array,
    count: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    removeGauge: PropTypes.func,
    setEnabled: PropTypes.func,
    router: PropTypes.object,
    source: PropTypes.object,
  };

  static defaultProps = {
    gauges: [],
    count: 0,
    admin: false,
  };

  render() {
    const {gauges, admin, count, loadMore} = this.props;
    return (
      <div style={styles.wrapper}>
        <AutoSizer>
          {({width, height}) => (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={loadMore}
              rowCount={count}
            >
              {({onRowsRendered, registerChild}) => (
                <Table
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  width={width}
                  height={height}
                  headerHeight={24}
                  rowHeight={32}
                  rowCount={gauges.length}
                  rowGetter={({index}) => gauges[index]}
                >
                  {admin && <Column width={12} flexGrow={0} dataKey="status" cellRenderer={this.renderStatus}/>}
                  <Column width={150} flexGrow={5} dataKey="name" label="Name"/>
                  {admin && <Column width={10} flexGrow={1} dataKey="code" label="Code"/>}
                  <Column width={40} flexGrow={0} dataKey="url" label="URL" cellRenderer={this.renderUrl}/>
                  <Column width={10} flexGrow={2} dataKey="lastFlow" label="Flow" cellDataGetter={this.getFlow}/>
                  <Column width={10} flexGrow={2} dataKey="lastLevel" label="Level" cellDataGetter={this.getLevel}/>
                  <Column width={150} flexGrow={0} dataKey="lastTimestamp" label="Date" cellRenderer={this.renderDate}/>
                  {admin && <Column width={90} flexGrow={2} dataKey="cron" label="Cron"/>}
                  {admin && <Column width={100} flexGrow={1} dataKey="requestParams" label="Params" cellDataGetter={this.getParams}/>}
                  {admin && <Column width={90} flexGrow={0} dataKey="controls" label="Controls" cellRenderer={this.renderControls}/>}
                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }

  isRowLoaded = ({ index }) => {
    return !!this.props.gauges[index];
  };

  getFlow = ({rowData}) => rowData.lastFlow ? (_.round(rowData.lastFlow, 4) + ' ' + rowData.flowUnit) : '';
  getLevel = ({rowData}) => rowData.lastLevel ? (_.round(rowData.lastLevel, 4) + ' ' + rowData.levelUnit) : '';
  getParams = ({rowData}) => rowData.requestParams && JSON.stringify(rowData.requestParams);
  renderUrl = ({cellData}) => (<a href={cellData}>Link</a>);

  renderDate = ({rowData}) => {
    const freshness = moment().diff(moment(rowData.lastTimestamp), 'days', true);
    return (
      <div>
        {rowData.lastTimestamp && moment(rowData.lastTimestamp).format('DD.MM.YYYY HH:mm')}
        {freshness > 1 && <FontIcon className="material-icons" color="red" style={styles.warnIcon}>warning</FontIcon>}
      </div>
    );
  };

  renderStatus = ({rowData: gauge}) => {
    const hasJobs = _.find(this.props.jobsReport, j => j._id === gauge._id && j.count > 0);
    const statusIconStyle = {...styles.statusIcon, color: hasJobs ? 'green' : 'red'};
    return (
      <FontIcon className="material-icons" style={statusIconStyle}>fiber_manual_record</FontIcon>
    );
  };

  renderControls = ({rowData: gauge}) => {
    const editHandler = () => this.props.router.push(`/gauges/${gauge._id}/settings`);
    const deleteHandler = () => this.props.removeGauge(gauge._id);
    const startStopHandler = () => this.props.setEnabled(gauge._id, !gauge.enabled);
    const stoppable = this.props.source && this.props.source.harvestMode === 'ONE_BY_ONE';
    return (
      <div>
        {stoppable && <IconButton iconClassName="material-icons" style={styles.iconWrapper}
                    onTouchTap={startStopHandler}>{gauge.enabled ? 'stop' : 'play_arrow'}</IconButton>}
        <IconButton iconClassName="material-icons" style={styles.iconWrapper}
                    onTouchTap={editHandler}>mode_edit</IconButton>
        <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
      </div>
    );
  };
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  statusIcon: {
    fontSize: 14,
  },
  iconWrapper: {
    paddingLeft: 2,
    paddingRight: 2,
    width: 'auto',
  },
  warnIcon: {
    fontSize: 16,
  },
};

export default container(ListGauges);