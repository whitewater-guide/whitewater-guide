import { fireEvent, screen } from '@testing-library/react';
import type {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import type { GraphQLResolveInfo } from 'graphql';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import RegionForm from './RegionForm';

jest.mock('../../../components/maps/DrawingMap');
jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Region: () => ({
    bounds: () => [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
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
    kind: () => 'other',
  }),
};

describe('existing region', () => {
  const match = { params: { regionId: 'foo' } };
  const renderIt = () => renderForm(<RegionForm match={match} />, { mocks });

  it('should begin in loading state', () => {
    renderIt();
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(() => screen.getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    renderIt();
    await expect(screen.findByLabelText('Name')).resolves.toHaveValue(
      'Region.name.1',
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

describe('new region', () => {
  const match = { params: {} };
  const options: MockedProviderOptions = {
    Query: { region: () => null },
    mocks,
  };
  const renderIt = () => renderForm(<RegionForm match={match} />, options);

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
    const fakeMap = await screen.findByTestId('fake_map');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    const button = await screen.findByText('Create');
    fireEvent.click(button);
    await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
