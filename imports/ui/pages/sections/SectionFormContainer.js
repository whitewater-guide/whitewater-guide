import {graphql} from 'react-apollo';
import {withState, withHandlers, mapProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';
import {Fragments} from './queries';
import _ from 'lodash';

const regionFragment = gql`
  fragment EditSectionRegionDetails on Region {
    _id
    name
    bounds {
      sw
      ne
    }
    sources {
      gauges {
        _id
        name
      }
    }
  }
`;

const sectionFragment = gql`
  fragment EditSectionSectionDetails on Section {
    ...SectionCore
    ...SectionGeo
    description
    region {
      ...EditSectionRegionDetails
    }
    ...SectionMeasurements
    gauge {
      name
    }
    ...SectionMedia
    ...SectionPOIs
  }
  ${Fragments.Core}
  ${Fragments.Geo}
  ${Fragments.Media}
  ${Fragments.Measurements}
  ${Fragments.POIs}
  ${regionFragment}
`;

const sectionDetails = gql`
  query sectionDetails($_id: ID, $regionId:ID, $riverId:ID, $language:String) {
    section(_id: $_id, language: $language) {
      ...EditSectionSectionDetails
    }

    region(_id: $regionId, language:$language) {
      rivers {
        _id
        name
      }
      ...EditSectionRegionDetails
    }
    
    river(_id: $riverId, language: $language) {
      _id
      name
      region {
        ...EditSectionRegionDetails
      }
    } 
  }
  ${sectionFragment}
`;


const upsertSection = gql`
  mutation upsertSection($section: SectionInput!, $language:String){
    upsertSection(section: $section, language: $language){
      ...EditSectionSectionDetails
    }
  }
  ${sectionFragment}
`;

export default compose(
  adminOnly,
  withRouter,
  withState('language', 'setLanguage', 'en'),
  mapProps(({params, location, ...props}) => ({
    ...props,
    _id: params.sectionId,
    riverId: params.riverId || location.query.riverId,
    regionId: params.regionId || location.query.regionId,
    multilang: !!params.sectionId,
    title: params.sectionId ? "Section settings" : "New section",
    submitLabel: params.sectionId ? "Update" : "Create",
    currentTab: location.hash || '#main',
    method: () => {},
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.router.goBack(),
    onCancel: props => () => props.router.goBack(),
  }),
  graphql(
    sectionDetails,
    {
      options: props => ({forceFetch: true}),
      props: ({data: {section, region, river, loading}}) => {
        //For region form we need
        //1) Region with bounds
        //2) List of rivers in case when we create section in region
        //3) List of gauges, which is collected from all sources of region
        region = section && section.region || river && river.region || region;
        const rivers = section && [section.river] || river && [river] || region && region.rivers || [];
        const gauges = region ? _.flatMap(region.sources, 'gauges') : [];
        section = section || {};
        if (river)
          section.river = river;
        section = filter(sectionFragment, section);
        delete section.region;//Do not need this in form data
        return {initialData: section, region, rivers, gauges, loading};
      },
    }
  ),
  graphql(
    upsertSection,
    {
      props: ({mutate, ownProps}) => ({
        method: ({data, language}) => {
          if (_.get(data, 'river._id') === '@@new')
            _.set(data, 'river.regionId', ownProps.regionId);
          return mutate({variables: {section: data, language}});
        }
      }),
    }
  ),
);