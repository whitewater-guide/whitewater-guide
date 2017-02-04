import React, {PropTypes} from 'react';
import {Column, Table, AutoSizer, InfiniteLoader} from 'react-virtualized';
import container from './ListGaugesContainer';
import _ from 'lodash';
import moment from 'moment';

class GaugesTable extends React.Component {
  static propTypes = {
    gauges: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
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
                  <Column width={12} flexGrow={0} dataKey="status"/>
                  <Column width={10} flexGrow={5} dataKey="name" label="Name"/>
                  <Column width={10} flexGrow={1} dataKey="code" label="Code"/>
                  <Column width={10} flexGrow={1} dataKey="url" label="URL" cellRenderer={this.renderUrl}/>
                  <Column width={10} flexGrow={1} dataKey="lastFlow" label="Flow" cellDataGetter={this.getFlow}/>
                  <Column width={10} flexGrow={1} dataKey="lastValue" label="Level" cellDataGetter={this.getLevel}/>
                  <Column width={10} flexGrow={1} dataKey="lastTimestamp" label="Date" cellDataGetter={this.getDate}/>
                  <Column width={10} flexGrow={1} dataKey="lastValue" label="Cron"/>
                  <Column width={10} flexGrow={1} dataKey="requestParams" label="Params" cellDataGetter={this.getParams}/>
                  <Column width={10} flexGrow={1} dataKey="controls" label="Controls"/>
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

  getFlow = ({rowData}) => _.round(rowData.lastFlow, 4);
  getLevel = ({rowData}) => _.round(rowData.lastLevel, 4);
  getDate = ({rowData}) => rowData.lastTimestamp && moment(rowData.lastTimestamp).format('DD/MM/YYYY HH:mm');
  getParams = ({rowData}) => rowData.requestParams && JSON.stringify(rowData.requestParams);

  renderUrl = ({cellData}) => {
    return (
      <a href={cellData}>Link</a>
    );
  };
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};

export default container(GaugesTable);