import { SECTION_NAME } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import get from 'lodash/get';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Text } from 'react-native';
import getTitleFontSize from '../../utils/getTitleFontSize';

interface Props {
  sectionId: string;
}

interface Result {
  section: Section;
}

const SectionTitle: React.StatelessComponent<Props> = ({ sectionId }) => (
  <Query
    query={SECTION_NAME}
    fetchPolicy="cache-only"
    variables={{ id: sectionId }}
  >
    {({ data }: QueryResult<Result>) => {
      const sName = get(data, 'section.name', null);
      const rName = get(data, 'section.river.name', null);
      if (!sName) {
        return null;
      }
      const fullName = `${rName} - ${sName}`;
      return (
        <Text style={{ fontSize: getTitleFontSize(fullName) }}>{fullName}</Text>
      );
    }}
  </Query>
);

export default SectionTitle;
