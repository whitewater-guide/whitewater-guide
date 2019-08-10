import { fireEvent } from '@testing-library/react';
import {
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients';
import { GraphQLResolveInfo } from 'graphql';
import React from 'react';
import { FORM_SUCCEEDED, renderForm } from '../../../../formik/test';
import { RegionAdminSettingsForm } from './RegionAdminSettingsForm';

jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Region: () => ({
    sku: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `region.sku${seq}`;
    },
  }),
};

const renderIt = () =>
  renderForm(<RegionAdminSettingsForm regionId="foo" />, { mocks });

it('should begin in loading state', () => {
  const { getByRole, getByLabelText } = renderIt();
  expect(getByRole('progressbar')).toBeTruthy();
  expect(() => getByLabelText('Name')).toThrow();
});

it('should provide initial data', async () => {
  const { findByLabelText, findByText } = renderIt();
  await expect(findByLabelText('SKU')).resolves.toHaveValue('region.sku1');
  await expect(findByText('Update')).resolves.toBeTruthy();
});

it('should submit form', async () => {
  const { findByText } = renderIt();
  const button = await findByText('Update');
  fireEvent.click(button);
  await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
});
