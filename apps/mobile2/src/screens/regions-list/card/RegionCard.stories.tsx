import { MockedProvider } from '@apollo/client/testing';
import { NavigationContainer } from '@react-navigation/native';
import type { Meta, StoryObj } from '@storybook/react';
import { AuthContext } from '@whitewater-guide/clients';
import React from 'react';

import { MOCK_USER } from '../../../core/auth/MockAuthService';
import type { ListedRegion } from '../useFavRegions';
import { RegionCard } from './RegionCard';

const MOCK_REGION: ListedRegion = {
  __typename: 'Region',
  id: 'region-1',
  name: 'Alps Whitewater',
  favorite: false,
  gauges: { __typename: 'RegionGaugeConnection', count: 12 },
  sections: { __typename: 'RegionSectionConnection', count: 34 },
  coverImage: {
    __typename: 'RegionCoverImage',
    mobile:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
};

interface WrapperProps {
  favorite?: boolean | null;
  authenticated?: boolean;
}

function RegionCardWrapper({
  favorite = false,
  authenticated = true,
}: WrapperProps) {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const authValue = {
    me: authenticated ? MOCK_USER : null,
    loading: false,
    service: {} as any,
    refreshProfile: () => Promise.resolve(),
  };

  return (
    <NavigationContainer>
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthContext.Provider value={authValue}>
          <RegionCard region={{ ...MOCK_REGION, favorite }} index={0} />
        </AuthContext.Provider>
      </MockedProvider>
    </NavigationContainer>
  );
}

const meta: Meta<typeof RegionCardWrapper> = {
  title: 'Screens/RegionsList/RegionCard',
  component: RegionCardWrapper,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Favorite: Story = {
  args: { favorite: true },
};

export const Authenticated: Story = {
  args: { authenticated: true, favorite: false },
};

export const Unauthenticated: Story = {
  args: { authenticated: false },
};
