import { fireEvent } from '@testing-library/react';
import {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import { GraphQLResolveInfo } from 'graphql';
import React from 'react';
import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import RegionForm from './RegionForm';

jest.mock('../../../components/maps/DrawingMap');
jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Region: () => ({
    bounds: () => [[0, 0, 0], [1, 1, 1], [2, 2, 2]],
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
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('Region.name.1');
    await expect(findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Update');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
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
    const { findByLabelText, findByText, findByTestId } = renderIt();
    const name = await findByLabelText('Name');
    const fakeMap = await findByTestId('fake_map');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    const button = await findByText('Create');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
