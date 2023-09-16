import { fireEvent, screen } from '@testing-library/react';
import type {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import type { GraphQLResolveInfo } from 'graphql';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import SourceForm from './SourceForm';

jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Source: () => ({
    url: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `https://url${seq}.com`;
    },
    cron: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `${seq} * * * *`;
    },
  }),
};

describe('existing source', () => {
  const match = { params: { sourceId: 'foo' } };
  const renderIt = () => renderForm(<SourceForm match={match} />, { mocks });

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue(
      'Source.name.1',
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

describe('new source', () => {
  const match = { params: {} };
  const options: MockedProviderOptions = {
    Query: { source: () => null },
    mocks,
  };
  const renderIt = () => renderForm(<SourceForm match={match} />, options);

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
