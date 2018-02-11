import { print } from 'graphql';
import { transformDocument } from 'graphql-ast-tools';
import { LIST_SECTIONS } from './listSections.query';

it('should generate correct query', () => {
  const inlinedQuery = transformDocument(LIST_SECTIONS);
  expect(print(inlinedQuery)).toMatchSnapshot();
});
