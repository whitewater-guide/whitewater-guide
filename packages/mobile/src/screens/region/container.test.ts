import { MockList } from 'graphql-tools';
import { LIST_SECTIONS, Result, Vars } from '../../ww-clients/features/sections';
import { createMockedProvider } from '../../ww-clients/test';
import { Section } from '../../ww-commons';

let seedSections: Section[];
let seedCount: number;

beforeAll(async () => {
  const provider = createMockedProvider({
    mocks: {
      SectionsList: () => ({
        nodes: () => new MockList(5),
        count: () => 5,
      }),
    },
  });
  const result = await provider.client.query<Result, Vars>({
    query: LIST_SECTIONS,
  });
  expect(result.data.sections).toMatchSnapshot();
  seedSections = result.data.sections.nodes!;
  seedCount = result.data.sections.count!;
});

it('should read result from cache first', async () => {

});

it('should pass empty list first when cache is empty', async () => {

});

it('should load initial data when cache contains no data', async () => {

});

it('should continue loading initial data when cache contains partial data', async () => {

});

it('should paginate initial data', async () => {

});

it('should set state to ready after all initial data has been loaded', async () => {

});

it('should start loading updates when cache is full', async () => {

});

it('should paginate updates', async () => {

});

it('should update sections count if updates contain new sections', async () => {

});

it('should set state to ready after all updates are loaded', async () => {

});

it('should not try to load anything when offline', async () => {

});

it('should release subscription when unmounted', async () => {

});

it('should poll lastMeasurements', async () => {

});

it('should pass updates when is changed outside the query', () => {

});

it('should apply filters', async () => {

});
