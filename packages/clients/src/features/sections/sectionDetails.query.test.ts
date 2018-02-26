import { print } from 'graphql';
import { transformDocument } from 'graphql-ast-tools';
import { SECTION_DETAILS } from './sectionDetails.query';

it('should generate correct query', () => {
  const inlinedQuery = transformDocument(SECTION_DETAILS);
  expect(print(inlinedQuery)).toMatchSnapshot();
});
