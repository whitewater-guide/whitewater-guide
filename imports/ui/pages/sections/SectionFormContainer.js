import {graphql} from 'react-apollo';
import {withState, withHandlers, mapProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';
import _ from 'lodash';

const regionFragment = gql`
  fragment SectionRegionDetails on Region {
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

const regionWithRiversFragment = gql`
  fragment SectionRegionWithRiverDetails on Region {
    rivers {
      _id
      name
    }
    ...SectionRegionDetails
  }
`;

const sectionDetailsFragment = gql`
  fragment SectionDetails on Section {
    _id
    name
    description
    season
    seasonNumeric
    region {
      ...SectionRegionDetails
    }
    river {
      _id
      name
    }
    gauge {
      _id
      name
    }
    levels {
      minimum
      maximum
      optimum
      impossible
      approximate
    }
    flows {
      minimum
      maximum
      optimum
      impossible
      approximate
    }
    putIn {
      _id
      coordinates
      altitude
    }
    takeOut {
      _id
      coordinates
      altitude
    }
    distance
    drop
    duration
    difficulty
    difficultyXtra
    rating
    media {
      _id
      description
      copyright
      url
      type
    }
    pois {
      _id
      name
      description
      coordinates
      altitude
      kind
    }
  }
  ${regionFragment}
`;

const sectionDetails = gql`
  query sectionDetails($_id: ID, $regionId:ID, $riverId:ID, $language:String) {
    section(_id: $_id, language: $language) {
      ...SectionDetails
    }

    region(_id: $regionId, language:$language) {
      ...SectionRegionWithRiverDetails
    }
    
    river(_id: $riverId, language: $language) {
      _id
      name
      region {
        ...SectionRegionDetails
      }
    } 

  }
  ${sectionDetailsFragment}
  ${regionWithRiversFragment}
`;


const upsertSection = gql`
  mutation upsertSection($section: SectionInput!, $language:String){
    upsertSection(section: $section, language: $language){
      ...SectionDetails
    }
  }
  ${sectionDetailsFragment}
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
        section = filter(sectionDetailsFragment, section);
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