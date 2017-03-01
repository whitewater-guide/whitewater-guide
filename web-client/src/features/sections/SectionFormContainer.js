import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import {withAdmin} from '../users';
import {withTags} from '../tags';
import {withFeatureIds} from '../../core/hoc';
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
    gauge {
      name
    }
    ...SectionMeasurements
    ...SectionMedia
    ...SectionPOIs
    ...SectionTags
  }
  ${Fragments.Core}
  ${Fragments.Geo}
  ${Fragments.Media}
  ${Fragments.Measurements}
  ${Fragments.POIs}
  ${Fragments.Tags}
  ${regionFragment}
`;

const sectionDetails = gql`
  query sectionDetails($sectionId: ID, $regionId:ID, $riverId:ID, $language:String) {
    section(_id: $sectionId, language: $language) {
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
  withAdmin(true),
  withFeatureIds(),
  withState('language', 'setLanguage', 'en'),
  withProps(({sectionId, location}) => ({
    multilang: !!sectionId,
    title: sectionId ? "Section settings" : "New section",
    submitLabel: sectionId ? "Update" : "Create",
    currentTab: location.hash || '#main',
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.goBack(),
    onCancel: props => () => props.goBack(),
  }),
  withTags,
  graphql(
    sectionDetails,
    {
      options: () => ({forceFetch: true}),
      props: ({data: {loading, ...data}}) => {
        let {section, region, river} = filter(sectionDetails, data);
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
        delete section.region;//Do not need this in form data
        return {initialData: section, region, rivers, gauges, loading};
      },
    }
  ),
  graphql(
    upsertSection,
    {
      props: ({mutate, ownProps}) => ({
        method: ({data: {river, ...section}, language}) => {
          let {_id, name, regionId, region} = river;
          if (_id === '@@new')
            regionId = ownProps.regionId;
          if (region)
            regionId = region._id;
          return mutate({variables: {section: {...section, river: {_id, name, regionId}}, language}});
        }
      }),
    }
  ),
);