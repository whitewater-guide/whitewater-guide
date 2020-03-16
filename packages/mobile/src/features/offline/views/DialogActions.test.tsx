import { render } from '@testing-library/react-native';
import React from 'react';
import DialogActions from './DialogActions';

it('should render background button when in progress', () => {
  const { getByLabelText } = render(
    <DialogActions
      canDownload={true}
      regionId="id"
      selection={{ data: true }}
      inProgress={true}
    />,
  );
  expect(getByLabelText('offline:dialog.inBackground')).toBeTruthy();
});

it('should cancel and download buttons in case of error', () => {
  const { getByLabelText } = render(
    <DialogActions
      canDownload={true}
      regionId="id"
      selection={{ data: true }}
      error={new Error()}
      inProgress={false}
    />,
  );
  expect(getByLabelText('offline:dialog.download')).toBeTruthy();
  expect(getByLabelText('commons:cancel')).toBeTruthy();
});

it('should cancel and download buttons in case of ready state', () => {
  const { getByLabelText } = render(
    <DialogActions
      canDownload={true}
      regionId="id"
      selection={{ data: true }}
      inProgress={false}
    />,
  );
  expect(getByLabelText('offline:dialog.download')).toBeTruthy();
  expect(getByLabelText('commons:cancel')).toBeTruthy();
});
