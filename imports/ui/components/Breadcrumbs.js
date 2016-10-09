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
    if (key === ':sourceId') {
      return this.props.source.name;
    }
    else if (key === ':gaugeId') {
      return this.props.gauge.name;
    }
    return key;
  };
}

const BreadcrumbsContainer = createContainer(
  (props) => {
    let result = { ready: true };
    if (props.params.gaugeId) {
      const gaugeSub = Meteor.subscribe('gauges.details', props.params.gaugeId);
      result = {
        ...result,
        ready: result.ready && gaugeSub.ready(),
        gauge: Gauges.findOne(props.params.gaugeId, { fields: { name: 1 } })
      };
    }
    if (props.params.sourceId) {
      const sourceSub = Meteor.subscribe('sources.details', props.params.sourceId);
      result = {
        ...result,
        ready: result.ready && sourceSub.ready(),
        source: Sources.findOne(props.params.sourceId, { fields: { name: 1 } })
      };
    }
    return result;
  },
  Breadcrumbs
);

export default BreadcrumbsContainer;