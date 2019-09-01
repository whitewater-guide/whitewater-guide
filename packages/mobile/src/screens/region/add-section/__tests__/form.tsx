import {
  fireEvent,
  render,
  RenderResult,
  wait,
  within,
} from '@testing-library/react-native';
import * as clients from '@whitewater-guide/clients';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppContainer } from 'react-navigation';
import { SnackbarProvider } from '../../../../components/snackbar';
import { I18nTestProvider } from '../../../../i18n/I18nTestProvider';
import { AddSectionStack } from '../AddSectionStack';

const mockMutate = jest.fn();
jest.mock('../useAddSection', () => () => mockMutate);
jest.mock('../../../../features/settings/useMapType');

const ApolloProvider = clients.mockApolloProvider();
const Nav = createAppContainer(AddSectionStack as any);
let test: RenderResult;

beforeEach(() => {
  jest.spyOn(clients, 'useRegion').mockImplementation(() => ({
    node: {
      id: '92c6338e-ca93-11e9-a32f-2a2ae2dbcce4',
      name: '__region_name__',
      bounds: [[0, 0, 0], [1, 1, 1], [2, 2, 2]],
    },
  }));
  test = render(
    <ApolloProvider>
      <PaperProvider>
        <I18nTestProvider>
          <SnackbarProvider>
            <Nav />
          </SnackbarProvider>
        </I18nTestProvider>
      </PaperProvider>
    </ApolloProvider>,
  );
});

afterEach(() => {
  test.unmount();
});

it('should render initial state', async () => {
  await expect(test.findByText('COMMONS:CREATE')).resolves.toBeTruthy();
});

it('should fill in main fields and submit', async () => {
  const [
    riverPlaceholder,
    name,
    difficulty,
    difficultyXtra,
    putInPlaceholder,
  ] = await Promise.all([
    test.findByLabelText('screens:addSection.main.riverLabel'),
    test.findByLabelText('screens:addSection.main.nameLabel'),
    test.findByLabelText('commons:difficulty'),
    test.findByTestId('difficultyXtra'),
    test.findByLabelText('commons:putIn'),
  ]);

  // Select river

  fireEvent.press(riverPlaceholder);
  const riverInput = await test.findByPlaceholderText(
    'screens:addSection.river.searchPlaceholder',
  );
  fireEvent.changeText(riverInput, 'River');
  const riverItem = await test.findByText('River');
  fireEvent.press(riverItem);
  const riverFakeInput = await test.findByTestId('river-field-fake-input');
  expect(riverFakeInput.props.value).toBe('River');

  // Select difficulty

  fireEvent.press(difficulty);
  const difficultyItem = await test.findByText('III - IV');
  fireEvent.press(difficultyItem);
  const difficultyFakeInput = await test.findByTestId('difficulty-fake-input');
  expect(difficultyFakeInput.props.value).toBe('III - IV');

  // Select put-in and take-out
  fireEvent.press(putInPlaceholder);
  const shapeFab = await test.findByLabelText('edit shape');
  fireEvent.press(shapeFab);
  const [piGroup, toGroup, shapeDialogOK] = await Promise.all([
    test.findByHintText('commons:putIn'),
    test.findByHintText('commons:takeOut'),
    test.findByText('COMMONS:OK'),
  ]);
  const piLat = await within(piGroup).findByLabelText('commons:latitude');
  const piLng = await within(piGroup).findByLabelText('commons:longitude');
  const piAlt = await within(piGroup).findByLabelText('commons:altitude');
  const toLat = await within(toGroup).findByLabelText('commons:latitude');
  const toLng = await within(toGroup).findByLabelText('commons:longitude');
  const toAlt = await within(toGroup).findByLabelText('commons:altitude');
  fireEvent.changeText(piLat, '1');
  fireEvent.changeText(piLng, '2');
  fireEvent.changeText(piAlt, '3');
  fireEvent.changeText(toLat, '4');
  fireEvent.changeText(toLng, '5');
  fireEvent.changeText(toAlt, '6');
  fireEvent.press(shapeDialogOK);
  const shapeDone = await test.findByText('COMMONS:DONE');
  fireEvent.press(shapeDone);

  await Promise.all([
    test.findByDisplayValue('1°0′0″ N, 2°0′0″ E'),
    test.findByDisplayValue('4°0′0″ N, 5°0′0″ E'),
  ]);

  fireEvent.changeText(name, 'Name');
  fireEvent.changeText(difficultyXtra, 'X');

  const createButton = await test.findByText('COMMONS:CREATE');
  fireEvent.press(createButton);
  await wait(() => {
    expect(mockMutate).toHaveBeenCalled();
    expect(mockMutate.mock.calls[0][0]).toMatchObject({
      id: null,
      name: 'Name',
      river: {
        id: '__NEW_ID__',
        name: 'River',
      },
      difficulty: 3.5,
      difficultyXtra: 'X',
      shape: [[2, 1, 3], [5, 4, 6]],
    });
  });
});
