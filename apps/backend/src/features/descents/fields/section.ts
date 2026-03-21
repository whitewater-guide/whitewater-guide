import type { DescentResolvers } from '../../../apollo/index';

const EMBEDDED_SECTION_FIELDS = ['__typename', 'id'];

const sectionResolver: DescentResolvers['section'] = async (
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
  const section = await dataSources.sections.getById(section_id);
  return section!;
};

export default sectionResolver;
