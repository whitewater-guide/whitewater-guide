import React, { Component, PropTypes } from 'react';
import { default as BCInternal } from 'react-router-breadcrumbs';

class Breadcrumbs extends Component {
  static propTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
  };

  render() {
    return (
      <BCInternal routes={this.props.routes} params={this.props.params} resolver={breadcrumbResolver} />
    );
  }
}

const breadcrumbResolver = (key, text, routePath, route) => {
  if (key === ':sourceId'){
    return text;
  }
  return key;
};

export default Breadcrumbs;