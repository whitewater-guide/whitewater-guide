import { fireEvent, screen } from '@testing-library/react';
import type { MockedProviderOptions } from '@whitewater-guide/clients/dist/test';
import React from 'react';
import type { RouteComponentProps } from 'react-router';
import type { DeepPartial } from 'utility-types';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import MediaForm from './MediaForm';
import type { RouterParams } from './types';

jest.mock('validator/lib/isUUID', () => () => true);

describe('existing media', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { mediaId: 'foo', sectionId: 'bar', regionId: 'baz' } },
  };
  const renderIt = () => renderForm(<MediaForm {...(route as any)} />);

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Description')).resolves.toHaveValue(
      'Media.description.1',
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

describe('new media', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { sectionId: 'bar', regionId: 'baz' } },
    location: { search: '?kind=video' },
  };
  const options: MockedProviderOptions = { Query: { media: () => null } };
  const renderIt = () => renderForm(<MediaForm {...(route as any)} />, options);

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Description')).resolves.toHaveValue(
      '',
    );
    await expect(screen.findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    renderIt();
    const url = await screen.findByLabelText('URL');
    const button = await screen.findByText('Create');
    fireEvent.change(url, { target: { value: 'https://foo.bar' } });
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
