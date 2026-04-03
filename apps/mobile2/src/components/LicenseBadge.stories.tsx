import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import LicenseBadge from './LicenseBadge';

const ccByLicense = {
  name: 'Attribution 4.0 International (CC BY 4.0)',
  slug: 'CC_BY',
  url: 'https://creativecommons.org/licenses/by/4.0/',
};

const commercialLicense = {
  name: 'All Rights Reserved',
  slug: null,
  url: null,
};

const publicDomainLicense = {
  name: 'Public Domain (CC0)',
  slug: 'CC0',
  url: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

const meta: Meta<typeof LicenseBadge> = {
  title: 'Components/LicenseBadge',
  component: LicenseBadge,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, maxWidth: 320 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    placement: 'region',
    license: ccByLicense,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CCLicense: Story = {
  args: { license: ccByLicense },
};

export const WithCopyright: Story = {
  args: { license: ccByLicense, copyright: 'Some Author 2024' },
};

export const Commercial: Story = {
  args: { license: commercialLicense, placement: 'region' },
};

export const PublicDomain: Story = {
  args: { license: publicDomainLicense },
};

export const WithDivider: Story = {
  args: { license: ccByLicense, divider: true },
};
