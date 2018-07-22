import { NavigationScreenProps } from 'react-navigation';
import { WithList, WithNode } from '../../ww-clients/apollo';
import { RegionContext } from '../../ww-clients/features/regions';
import { WithSectionsList } from '../../ww-clients/features/sections';
import { Region, Section } from '../../ww-commons';

export interface ScreenProps {
  region: WithNode<Region | null>;
  sections: WithList<Section>;
}

export interface NavParams {
  regionId: string;
}

export type OuterProps = NavigationScreenProps<NavParams> & Pick<RegionContext, 'region' | 'searchTerms'>;

export type InnerProps = WithSectionsList;
