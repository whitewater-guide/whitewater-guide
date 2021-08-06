import { DescentResolvers } from '~/apollo';

const EMBEDDED_SECTION_FIELDS = ['__typename', 'id'];

const sectionResolver: DescentResolvers['section'] = (
  { section_id },
  _,
  { dataSources, fieldsByType },
) => {
  const sectionFields = fieldsByType.get('Section');

  if (
    sectionFields &&
    Array.from(sectionFields).every((name) =>
      EMBEDDED_SECTION_FIELDS.includes(name),
    )
  ) {
    return {
      id: section_id,
    };
  }
  return dataSources.sections.getById(section_id);
};

export default sectionResolver;
