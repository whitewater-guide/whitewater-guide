import React, { Component, PropTypes } from 'react';
import { default as BCInternal } from 'react-router-breadcrumbs';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Gauges } from '../../api/gauges';
import { Sources } from '../../api/sources';

class Breadcrumbs extends Component {
  static propTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    source: PropTypes.object,
    gauge: PropTypes.object,
    ready: PropTypes.bool,
  };

  render() {
    return (
      <BCInternal routes={this.props.routes} params={this.props.params} resolver={this.breadcrumbResolver} />
    );
  }

  breadcrumbResolver = (key, text, routePath, route) => {
    if (!this.props.ready) {
      return text;
    }
    if (key === ':sourceId' && this.props.source) {
      return this.props.source.name;
    }
    else if (key === ':gaugeId' && this.props.gauge) {
      return this.props.gauge.name;
    }
    return key;
  };
}

const BreadcrumbsContainer = createContainer(
  (props) => {
    //Do not subscribe to Gauges/Sources here. The subscription is on main page
    let result = { ready: true };
    if (props.params.gaugeId) {
      result = {
        ...result,
        gauge: Gauges.findOne(props.params.gaugeId, { fields: { name: 1 } })
      };
    }
    if (props.params.sourceId) {
      result = {
        ...result,
        source: Sources.findOne(props.params.sourceId, { fields: { name: 1 } })
      };
    }
    return result;
  },
  Breadcrumbs
);

export default BreadcrumbsContainer;