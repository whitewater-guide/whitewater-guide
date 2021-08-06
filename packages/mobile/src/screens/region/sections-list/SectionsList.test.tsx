import { fireEvent, render } from '@testing-library/react-native';
import {
  ListedSectionFragment,
  SectionsStatus,
} from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/schema';
import set from 'lodash/fp/set';
import noop from 'lodash/noop';
import React from 'react';

import { SectionsList } from './SectionsList';

jest.mock('@react-navigation/native', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...jest.requireActual<{}>('@react-navigation/native'),
  useNavigation: () => ({}),
}));

const region: Partial<Region> = {
  __typename: 'Region',
  id: 'fb228626-d795-11e9-8a34-2a2ae2dbcce4',
  name: 'Region name',
  premium: false,
  hasPremiumAccess: false,
};

const sections: ListedSectionFragment[] = [
  {
    __typename: 'Section',
    id: '29425d60-d796-11e9-8a34-2a2ae2dbcce4',
    name: 'Section name',
    region: region as any,
    river: {
      id: 'e6b06568-d796-11e9-8a34-2a2ae2dbcce4',
      name: 'river name',
    } as any,
    altNames: [],
    demo: false,
    difficulty: 3.5,
    difficultyXtra: null,
    distance: null,
    drop: null,
    duration: null,
    rating: 3,
    updatedAt: new Date(2000, 0).toISOString(),
    hidden: false,
    helpNeeded: null,
    tags: [],
    putIn: {
      id: '1',
      coordinates: [1, 1, 1],
      kind: 'put-in',
    },
    takeOut: {
      id: '2',
      coordinates: [2, 2, 2],
      kind: 'take-out',
    },
    season: null,
    seasonNumeric: [],
    flows: {
      minimum: 10,
      optimum: 20,
      maximum: 30,
      impossible: 40,
    },
    gauge: {
      id: '1615082c-d797-11e9-9d36-2a2ae2dbcce4',
      flowUnit: 'cms',
      levelUnit: null,
      code: 'qwerty',
      latestMeasurement: {
        flow: 25,
        timestamp: new Date(2018, 8, 8).toISOString(),
      },
    } as any,
    flowsText: null,
    levels: null,
  },
];

it('should be updated when measurements are updated', () => {
  const ref = React.createRef<any>();
  const props: React.ComponentProps<typeof SectionsList> = {
    refresh: jest.fn(),
    status: SectionsStatus.READY,
    region: region as any,
    sections,
  };
  const { rerender, getByText, getByTestId } = render(
    <SectionsList ref={ref} {...props} />,
  );
  const recycler = getByTestId('sections-list-recycler');
  jest.spyOn(ref.current, 'scrollToOffset').mockImplementation(noop);
  fireEvent(recycler, 'sizeChanged', { width: 500, height: 1000 });
  expect(getByText(/25\.00/)).toBeTruthy();
  const newSections = set(
    '0.gauge.latestMeasurement.flow',
    777,
    set(
      '0.gauge.latestMeasurement.timestamp',
      new Date().toISOString(),
      sections,
    ),
  );
  rerender(<SectionsList {...props} sections={newSections} ref={ref} />);
  expect(getByText(/777\.00/)).toBeTruthy();
});
