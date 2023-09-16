import { fireEvent, screen } from '@testing-library/react';
import type {
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients/dist/test';
import type { GraphQLResolveInfo } from 'graphql';
import React from 'react';

import { FORM_SUCCEEDED, renderForm } from '../../../../formik/test';
import { RegionAdminSettingsForm } from './RegionAdminSettingsForm';

jest.mock('validator/lib/isUUID', () => ({
  __esModule: true,
  default: () => true,
}));

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
  RegionCoverImage: () => ({
    mobile: () => 'https://ya.ru/img1.jpg',
  }),
};

const renderIt = () =>
  renderForm(<RegionAdminSettingsForm regionId="foo" />, { mocks });

it('should begin in loading state', () => {
  renderIt();
  expect(screen.getByRole('progressbar')).toBeTruthy();
  expect(() => screen.getByLabelText('Name')).toThrow();
});

it('should provide initial data', async () => {
  renderIt();
  await expect(screen.findByLabelText('SKU')).resolves.toHaveValue(
    'region.sku1',
  );
  await expect(screen.findByText('Update')).resolves.toBeTruthy();
});

it('should submit form', async () => {
  renderIt();
  const button = await screen.findByText('Update');
  fireEvent.click(button);
  await expect(screen.findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
});
