import get from 'lodash/get';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { SECTION_NAME } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';

interface Props {
  sectionId: string;
}

interface Result {
  section: Section;
}

const SectionTitle: React.StatelessComponent<Props> = ({ sectionId }) => (
  <Query query={SECTION_NAME} fetchPolicy="cache-only" variables={{ id: sectionId }}>
    {({ data }: QueryResult<Result>) => {
      const sName = get(data, 'section.name', null);
      const rName = get(data, 'section.river.name', null);
      return sName ? `${rName} - ${sName}` : null;
    }}
  </Query>
);

export default SectionTitle;
