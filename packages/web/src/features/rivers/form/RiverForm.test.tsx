import { fireEvent, screen } from '@testing-library/react';
import type { MockedProviderOptions } from '@whitewater-guide/clients/dist/test';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import RiverForm from './RiverForm';

jest.mock('validator/lib/isUUID', () => () => true);

describe('existing river', () => {
  const match = { params: { riverId: 'foo', regionId: 'bar' } };
  const renderIt = () => renderForm(<RiverForm match={match} />);

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue(
      'River.name.1',
    );
    await expect(screen.findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    renderIt();
    const button = await screen.findByText('Update');
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('new river', () => {
  const match = { params: { regionId: 'bar' } };
  const options: MockedProviderOptions = { Query: { river: () => null } };
  const renderIt = () => renderForm(<RiverForm match={match} />, options);

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue('');
    await expect(screen.findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    renderIt();
    const name = await screen.findByLabelText('Name');
    const button = await screen.findByText('Create');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
