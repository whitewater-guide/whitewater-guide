import {graphql} from 'react-apollo';
import {withState, withProps, withHandlers, compose} from 'recompose';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../core/hoc';
import gql from 'graphql-tag';
import {withRegion} from './containers/withRegion';
import {Fragments} from './queries';

const editRegion = gql`
  mutation editRegion($region: RegionInput!, $language:String){
    upsertRegion(region: $region, language: $language){
      ...RegionCore
      ...RegionPOIs
    }
  }
  ${Fragments.Core}
  ${Fragments.POIs}
`;

export default compose(
  withAdmin(true),
  withFeatureIds('region'),
  withProps(({regionId}) => ({
    _id: regionId,
    multilang: !!regionId,
    title: regionId ? "Region settings" : "New region",
    submitLabel: regionId ? "Update" : "Create",
  })),
  withState('language', 'setLanguage', 'en'),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.history.goBack(),
    onCancel: props => () => props.history.goBack(),
  }),
  withRegion({propName: 'initialData'}),
  graphql(
    editRegion,
    {
      options: {
        fragments: [Fragments.Core, Fragments.POIs]
      },
      props: ({mutate}) => ({
        method: ({data, language}) => {
          return mutate({variables: {region: data, language}});
        }
      }),
    }
  ),
);