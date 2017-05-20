import { graphql, gql } from 'react-apollo';
import { withState, withHandlers, withProps, compose } from 'recompose';
import { filter } from 'graphql-anywhere';
import { withAdmin } from '../users';
import { withTags } from '../../commons/features/tags';
import { withFeatureIds } from '../../commons/core';
import { SectionFragments } from '../../commons/features/sections';
import _ from 'lodash';

const regionFragment = gql`
  fragment EditSectionRegionDetails on Region {
    _id
    name
    bounds
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
    ...SectionShape
    description
    region {
      ...EditSectionRegionDetails
    }
    gauge {
      name
    }
    gauge {
      _id
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
    ...SectionMedia
    ...SectionPOIs
    ...SectionTags
  }
  ${SectionFragments.Core}
  ${SectionFragments.Shape}
  ${SectionFragments.Media}
  ${SectionFragments.POIs}
  ${SectionFragments.Tags}
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
  withProps(({ sectionId, location }) => ({
    multilang: !!sectionId,
    title: sectionId ? "Section settings" : "New section",
    submitLabel: sectionId ? "Update" : "Create",
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.history.goBack(),
    onCancel: props => () => props.history.goBack(),
  }),
  withTags,
  graphql(
    sectionDetails,
    {
      options: () => ({ fetchPolicy: 'network-only' }),
      props: ({ data: { loading, ...data } }) => {
        let { section, region, river } = filter(sectionDetails, data);
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
        return { initialData: section, region, rivers, gauges, loading };
      },
    }
  ),
  graphql(
    upsertSection,
    {
      props: ({ mutate, ownProps }) => ({
        method: ({ data: { river, ...section }, language }) => {
          let { _id, name, regionId, region } = river;
          if (_id === '@@new')
            regionId = ownProps.regionId;
          if (region)
            regionId = region._id;
          return mutate({ variables: { section: { ...section, river: { _id, name, regionId } }, language } });
        }
      }),
    }
  ),
);