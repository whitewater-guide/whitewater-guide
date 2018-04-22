import { NavigationScreenProps } from '../../../typings/react-navigation';
import { WithList, WithNode } from '../../ww-clients/apollo';
import { WithRegion } from '../../ww-clients/features/regions';
import { WithSectionsList } from '../../ww-clients/features/sections';
import { Region, Section } from '../../ww-commons';

export interface ScreenProps {
  region: WithNode<Region>;
  sections: WithList<Section>;
}

export interface DispatchProps {
  selectRegion: (payload: { regionId: string | null }) => void;
}

export interface NavParams {
  regionId: string;
}

export type OuterProps = NavigationScreenProps<NavParams>;

export type InnerProps = DispatchProps & WithRegion & WithSectionsList;
