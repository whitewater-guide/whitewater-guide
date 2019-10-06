import { fireEvent } from '@testing-library/react';
import {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import { GraphQLResolveInfo } from 'graphql';
import React from 'react';
import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import { BannerForm } from './BannerForm';

jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Banner: () => ({
    link: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `https://url${seq}.com`;
    },
    slug: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return 'slug' + seq;
    },
  }),
  BannerSource: () => ({
    ratio: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return 4 + seq / 100;
    },
  }),
};

describe('existing banner', () => {
  const match = { params: { bannerId: 'foo' } };
  const renderIt = () => renderForm(<BannerForm match={match} />, { mocks });

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('Banner.name.1');
    await expect(findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Update');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('new banner', () => {
  const match = { params: {} };
  const options: MockedProviderOptions = {
    Query: { banner: () => null },
    mocks,
  };
  const renderIt = () => renderForm(<BannerForm match={match} />, options);

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
    const slug = await findByLabelText('Slug');
    const radio = await findByLabelText('WebView');
    fireEvent.click(radio);
    const ratio = await findByLabelText('Ratio');
    const url = await findByLabelText('URL');
    const button = await findByText('Create');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.change(slug, { target: { value: 'slug' } });
    fireEvent.change(url, { target: { value: 'https://test.com' } });
    fireEvent.change(ratio, { target: { value: '4' } });
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
