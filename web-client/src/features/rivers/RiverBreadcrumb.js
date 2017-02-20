import React, {PropTypes} from 'react';
import {Breadcrumb, BreadcrumbSeparator} from '../../core/components';
import container from './RiverBreadcrumbContainer';

class RiverBreadcrumb extends React.Component {
  static propTypes = {
    river: PropTypes.object,
    loading: PropTypes.bool,
  };

  render() {
    const {river, loading} = this.props;
    if (!river || loading)
      return null;
    return (
      <div>
        <Breadcrumb label={river.region.name} link={`/regions/${river.region._id}`}/>
        <BreadcrumbSeparator/>
        <Breadcrumb label={river.name}/>
      </div>
    );
  }
}

export default container(RiverBreadcrumb);
