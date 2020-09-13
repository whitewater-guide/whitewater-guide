import { fireEvent } from '@testing-library/react';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import SectionAdmin from './SectionAdmin';

jest.mock('validator/lib/isUUID', () => () => true);

const match = { params: { sectionId: 'foo' } };

const renderIt = () => renderForm(<SectionAdmin match={match} />);

it('should begin in loading state', () => {
  const { getByRole, getByLabelText } = renderIt();
  expect(getByRole('progressbar')).toBeTruthy();
  expect(() => getByLabelText('Name')).toThrow();
});

it('should provide initial data', async () => {
  const { findByLabelText, findByText } = renderIt();
  await expect(findByLabelText(/Demo/)).resolves.toBeTruthy();
  await expect(findByText('Update')).resolves.toBeTruthy();
});

it('should submit form', async () => {
  const { findByText } = renderIt();
  const button = await findByText('Update');
  fireEvent.click(button);
  await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
});
