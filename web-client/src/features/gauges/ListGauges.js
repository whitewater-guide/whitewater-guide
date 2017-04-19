import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer, InfiniteLoader} from 'react-virtualized';
import container from './ListGaugesContainer';
import GaugesTable from './GaugesTable';
import { GaugesPropType } from '../../commons/features/gauges';

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};

class ListGauges extends React.Component {
  static propTypes = {
    gauges: GaugesPropType.isRequired,
    jobsReport: PropTypes.array,
    admin: PropTypes.bool.isRequired,
    removeGauge: PropTypes.func,
    setEnabled: PropTypes.func,
    history: PropTypes.object,
    source: PropTypes.object,
  };

  static defaultProps = {
    jobsReport: [],
    source: {},
  };

  onDeleteGauge = gaugeId => this.props.removeGauge(gaugeId);

  onEditGauge = gaugeId => this.props.history.push(`/sections/${gaugeId}/settings`);

  onToggleGauge = (gaugeId, enabled) => this.props.setEnabled(gaugeId, enabled);

  onGaugeClick = gaugeId => this.props.history.push(`/sections/${gaugeId}`);

  isRowLoaded = ({ index }) => !!this.props.gauges.list[index];

  loadMoreRows = (params) => {
    const { loading, loadMore } = this.props.gauges;
    return loading ? Promise.resolve() : loadMore(params);
  };

  render() {
    const { gauges, admin, source, jobsReport } = this.props;
    const { count, list } = gauges;
    return (
      <div style={styles.wrapper}>
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={count}
            >
              {({ onRowsRendered, registerChild }) => (
                <GaugesTable
                  registerChild={registerChild}
                  onRowsRendered={onRowsRendered}
                  width={width}
                  height={height}
                  admin={admin}
                  gauges={list}
                  jobsReport={jobsReport}
                  source={source}
                  onDeleteGauge={this.onDeleteGauge}
                  onEditGauge={this.onEditGauge}
                  onToggleGauge={this.onToggleGauge}
                  onGaugeClick={this.onGaugeClick}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default container(ListGauges);
