import { fireEvent, screen } from '@testing-library/react';
import type {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import type { GraphQLResolveInfo } from 'graphql';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import GaugeForm from './GaugeForm';

jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Gauge: () => ({
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
  Point: () => ({
    coordinates: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq: lng } = ctx.counters.resolveNext(info);
      const { seq: lat } = ctx.counters.resolveNext(info);
      const { seq: alt } = ctx.counters.resolveNext(info);
      return [lng, lat, alt];
    },
    kind: () => 'gauge',
  }),
};

describe('existing gauge', () => {
  const match = { params: { sourceId: 'bar', gaugeId: 'foo' } };
  const renderIt = () => renderForm(<GaugeForm match={match} />, { mocks });

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue(
      'Gauge.name.1',
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

describe('new gauge', () => {
  const match = { params: { sourceId: 'foo' } };
  const options: MockedProviderOptions = {
    Query: { gauge: () => null },
    mocks,
  };
  const renderIt = () => renderForm(<GaugeForm match={match} />, options);

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
    const code = await screen.findByLabelText('Code');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.change(code, { target: { value: 'bar' } });
    const button = await screen.findByText('Create');
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
