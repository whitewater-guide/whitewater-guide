import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import SectionAdmin from './SectionAdmin';

jest.mock('validator/lib/isUUID', () => () => true);

const match = { params: { sectionId: 'foo' } };

const renderIt = () => renderForm(<SectionAdmin match={match} />);

it('should begin in loading state', () => {
  renderIt();
  expect(screen.getByRole('progressbar')).toBeTruthy();
  expect(() => screen.getByLabelText('Name')).toThrow();
});

it('should provide initial data', async () => {
  renderIt();
  await expect(screen.findByLabelText(/Demo/)).resolves.toBeTruthy();
  await expect(screen.findByText('Update')).resolves.toBeTruthy();
});

it('should submit form', async () => {
  renderIt();
  const button = await screen.findByText('Update');
  fireEvent.click(button);
  await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
});
