import React, {PropTypes} from 'react';
import {Column, Table, AutoSizer, InfiniteLoader} from 'react-virtualized';
import IconButton from 'material-ui/IconButton';
import container from './ListRiversContainer';

class ListRivers extends React.Component {
  static propTypes = {
    rivers: PropTypes.array.isRequired,
    admin: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    removeRiver: PropTypes.func,
  };

  static defaultProps = {
    rivers: [],
    count: 0,
    admin: false,
  };

  render() {
    const {rivers, admin, count, loadMore} = this.props;
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
                  rowCount={rivers.length}
                  rowGetter={({index}) => rivers[index]}
                  onRowClick={this.onRowClick}
                >
                  <Column width={10} flexGrow={2} dataKey="name" label="Name"/>
                  <Column width={10} flexGrow={1} dataKey="region" label="Region" cellDataGetter={this.getRegion}/>
                  <Column width={10} flexGrow={3} dataKey="description" label="Description"/>
                  {admin && <Column width={75} flexGrow={0} dataKey="controls" label="Controls" cellRenderer={this.renderControls}/>}
                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }

  isRowLoaded = ({ index }) => {
    return !!this.props.rivers[index];
  };

  getRegion = ({rowData}) => rowData.region.name;

  renderControls = ({rowData}) => {
    const editHandler = () => this.props.push(`/rivers/${rowData._id}/settings`);
    const deleteHandler = () => this.props.removeRiver(rowData._id);
    return (
      <span onClick={(event) => event.stopPropagation()}>
        <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={editHandler}>mode_edit</IconButton>
        <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
      </span>
    );
  };

  onRowClick = ({index}) => this.props.push(`/rivers/${this.props.rivers[index]._id}`);
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  iconWrapper: {
    paddingLeft: 2,
    paddingRight: 2,
    width: 'auto',
  },
};

export default container(ListRivers);