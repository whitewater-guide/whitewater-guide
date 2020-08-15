import { NavigationContainer } from '@react-navigation/native';
import {
  fireEvent,
  render,
  RenderResult,
  wait,
  within,
} from '@testing-library/react-native';
import * as clients from '@whitewater-guide/clients';
import { mockApolloProvider } from '@whitewater-guide/clients/dist/test';
import React from 'react';
import { Clipboard } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from '~/components/snackbar';
import { I18nTestProvider } from '../../../i18n/I18nTestProvider';
import AddSectionScreen from '../AddSectionScreen';

const mockMutate = jest.fn();
jest.mock('../getPager');
jest.mock('../useAddSection', () => () => mockMutate);
jest.mock('../../../../features/settings/useMapType');

const ApolloProvider = mockApolloProvider();
let test: RenderResult;

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(Clipboard, 'getString').mockResolvedValue('');
  jest.spyOn(clients, 'useRegion').mockImplementation(
    () =>
      ({
        node: {
          id: '92c6338e-ca93-11e9-a32f-2a2ae2dbcce4',
          name: '__region_name__',
          bounds: [
            [0, 0, 0],
            [1, 1, 1],
            [2, 2, 2],
          ],
        },
      } as any),
  );
  test = render(
    <ApolloProvider>
      <PaperProvider>
        <I18nTestProvider>
          <SnackbarProvider>
            <NavigationContainer>
              <AddSectionScreen />
            </NavigationContainer>
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
  await expect(test.findByText('commons:create')).resolves.toBeTruthy();
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
  const [piGroup, toGroup] = await Promise.all([
    test.findByHintText('commons:putIn'),
    test.findByHintText('commons:takeOut'),
  ]);
  const piLat = within(piGroup).getByLabelText('commons:latitude');
  const piLng = within(piGroup).getByLabelText('commons:longitude');
  const piAlt = within(piGroup).getByLabelText('commons:altitude');
  const toLat = within(toGroup).getByLabelText('commons:latitude');
  const toLng = within(toGroup).getByLabelText('commons:longitude');
  const toAlt = within(toGroup).getByLabelText('commons:altitude');
  fireEvent.changeText(piLat, '1');
  fireEvent.changeText(piLng, '2');
  fireEvent.changeText(piAlt, '3');
  fireEvent.changeText(toLat, '4');
  fireEvent.changeText(toLng, '5');
  fireEvent.changeText(toAlt, '6');
  const shapeDialogOK = await test.findByLabelText('commons:ok');
  fireEvent.press(shapeDialogOK);
  const shapeDone = await test.findByLabelText('commons:done');
  fireEvent.press(shapeDone);

  await Promise.all([
    test.findByDisplayValue('1.0000, 2.0000'),
    test.findByDisplayValue('4.0000, 5.0000'),
  ]);

  fireEvent.changeText(name, 'Name');
  fireEvent.changeText(difficultyXtra, 'X');

  const createButton = await test.findByLabelText('commons:create');
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
      shape: [
        [2, 1, 3],
        [5, 4, 6],
      ],
    });
  });
});
