import PropTypes from 'prop-types';
import React from 'react';
import {Breadcrumb, BreadcrumbSeparator} from '../../core/components';
import container from './SectionBreadcrumbContainer';

class SectionBreadcrumb extends React.Component {
  static propTypes = {
    section: PropTypes.object,
    loading: PropTypes.bool,
  };

  render() {
    const {section, loading} = this.props;
    if (!section || loading)
      return null;
    return (
      <div>
        <Breadcrumb label={section.region.name} link={`/regions/${section.region._id}`}/>
        <BreadcrumbSeparator/>
        <Breadcrumb label={section.river.name} link={`/rivers/${section.river._id}`}/>
        <BreadcrumbSeparator/>
        <Breadcrumb label={section.name}/>
      </div>
    );
  }
}

export default container(SectionBreadcrumb);
