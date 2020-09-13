import { fireEvent } from '@testing-library/react';
import { MockedProviderOptions } from '@whitewater-guide/clients/dist/test';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { DeepPartial } from 'utility-types';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import MediaForm from './MediaForm';
import { RouterParams } from './types';

jest.mock('validator/lib/isUUID', () => () => true);

describe('existing media', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { mediaId: 'foo', sectionId: 'bar', regionId: 'baz' } },
  };
  const renderIt = () => renderForm(<MediaForm {...(route as any)} />);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Description')).resolves.toHaveValue(
      'Media.description.1',
    );
    await expect(findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Update');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
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
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Description')).resolves.toHaveValue('');
    await expect(findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByLabelText, findByText } = renderIt();
    const url = await findByLabelText('URL');
    const button = await findByText('Create');
    fireEvent.change(url, { target: { value: 'https://foo.bar' } });
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
