import React, {Component, PropTypes} from 'react';

/**
import {default as BCInternal} from 'react-router-breadcrumbs';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Gauges} from '../../api/gauges';
import {Sources} from '../../api/sources';
import {Rivers} from '../../api/rivers';
import {Sections} from '../../api/sections';
import {Regions} from '../../api/regions';
import _ from 'lodash';

class Breadcrumbs extends Component {
  static propTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    source: PropTypes.object,
    gauge: PropTypes.object,
    river: PropTypes.object,
    region: PropTypes.object,
    section: PropTypes.object,
  };

  render() {
    return (
      <BCInternal routes={this.props.routes} params={this.props.params} resolver={this.breadcrumbResolver}/>
    );
  }

  breadcrumbResolver = (key, text, routePath, route) => {
    let cleanKey = key.substring(1);
    if (cleanKey in collections){
      cleanKey = cleanKey.substring(0, cleanKey.length - 2);
      try {
        if (cleanKey === 'section') {
          return this.props.section.riverName + ' - ' + this.props.section.name;
        }
        else {
          return this.props[cleanKey].name;
        }
      }
      catch(err){}
    }
    return key;
  };
}

const collections = {
  'riverId': Rivers,
  'gaugeId': Gauges,
  'sectionId': Sections,
  'regionId': Regions,
  'sourceId': Sources,
};

const BreadcrumbsContainer = createContainer(
  (props) => {
    return _
      .chain(props.params)
      .pick(_.keys(collections))
      .reduce(
        (result, value, key) => {
          const propName = key.substring(0, key.length-2);
          const collection = collections[key];
          //Should be available from publications on pages
          const propValue = collection.findOne(value, {fields: {name: 1, riverName: 1}});
          return {...result, [propName]: propValue};
        },
        {}
      )
      .value();
  },
  Breadcrumbs
);

export default BreadcrumbsContainer;
**/

export class Breadcrumbs extends Component {
  render(){
    return (
      <span>Breadcrumbs...</span>
    )
  }
}