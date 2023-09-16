import { fireEvent, screen } from '@testing-library/react';
import type {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import type { GraphQLResolveInfo } from 'graphql';
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
      return `slug${seq}`;
    },
  }),
  BannerSource: () => ({
    url: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `https://banner${seq}.com`;
    },
  }),
};

describe('existing banner', () => {
  const match = { params: { bannerId: 'foo' } };
  const renderIt = () => renderForm(<BannerForm match={match} />, { mocks });

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue(
      'Banner.name.1',
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

describe('new banner', () => {
  const match = { params: {} };
  const options: MockedProviderOptions = {
    Query: { banner: () => null },
    mocks,
  };

  const renderIt = () => renderForm(<BannerForm match={match} />, options);

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveTextContent('');
    await expect(screen.findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    renderIt();
    const name = await screen.findByLabelText('Name');
    const slug = await screen.findByLabelText('Slug');
    const radio = await screen.findByLabelText('WebView');
    fireEvent.click(radio);
    const url = await screen.findByLabelText('URL');
    const button = await screen.findByText('Create');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.change(slug, { target: { value: 'slug' } });
    fireEvent.change(url, { target: { value: 'https://test.com' } });
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
