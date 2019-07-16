import { SECTION_NAME } from '@whitewater-guide/clients';
import { Section, sectionName } from '@whitewater-guide/commons';
import React from 'react';
import { Query } from 'react-apollo';
import { Text } from 'react-native';
import getTitleFontSize from '../../utils/getTitleFontSize';

interface Props {
  sectionId: string;
}

interface Result {
  section: Section;
}

const SectionTitle: React.FC<Props> = ({ sectionId }) => (
  <Query<Result>
    query={SECTION_NAME}
    fetchPolicy="cache-only"
    variables={{ id: sectionId }}
  >
    {({ data }) => {
      const fullName = sectionName(data && data.section);
      return (
        <Text style={{ fontSize: getTitleFontSize(fullName) }}>{fullName}</Text>
      );
    }}
  </Query>
);

export default SectionTitle;
