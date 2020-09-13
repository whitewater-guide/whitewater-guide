import { fireEvent } from '@testing-library/react';
import { MockedProviderOptions } from '@whitewater-guide/clients/dist/test';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import RiverForm from './RiverForm';

jest.mock('validator/lib/isUUID', () => () => true);

describe('existing river', () => {
  const match = { params: { riverId: 'foo', regionId: 'bar' } };
  const renderIt = () => renderForm(<RiverForm match={match} />);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('River.name.1');
    await expect(findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Update');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('new river', () => {
  const match = { params: { regionId: 'bar' } };
  const options: MockedProviderOptions = { Query: { river: () => null } };
  const renderIt = () => renderForm(<RiverForm match={match} />, options);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('');
    await expect(findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByLabelText, findByText } = renderIt();
    const name = await findByLabelText('Name');
    const button = await findByText('Create');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
