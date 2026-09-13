import type { Meta, StoryObj } from '@storybook/react-native';

import { RegionCard, type ListedRegion } from './region-card';

import { AuthProvider, MOCK_USER } from '@/features/auth';

const MOCK_REGION: ListedRegion = {
  id: 'region-1',
  name: 'Alps Whitewater',
  favorite: false,
  gauges: { count: 12 },
  sections: { count: 34 },
  coverImage: {
    mobile:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
};

export interface RegionCardStoryProps {
  favorite?: boolean | null;
  authenticated?: boolean;
}

function RegionCardWrapper({
  favorite = false,
  authenticated = true,
}: RegionCardStoryProps) {
  const authValue = {
    me: authenticated ? MOCK_USER : null,
    loading: false,
  };

  return (
    <AuthProvider value={authValue}>
      <RegionCard region={{ ...MOCK_REGION, favorite }} index={0} />
    </AuthProvider>
  );
}

const meta = {
  title: 'Screens/RegionsList/RegionCard',
  component: RegionCardWrapper,
} satisfies Meta<typeof RegionCardWrapper>;

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
