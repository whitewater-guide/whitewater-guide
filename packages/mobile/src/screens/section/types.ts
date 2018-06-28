import { NavigationScreenProps } from 'react-navigation';
import { WithNode } from '../../ww-clients/apollo';
import { WithSection } from '../../ww-clients/features/sections';
import { Section } from '../../ww-commons';

export interface ScreenProps {
  section: WithNode<Section>;
}

export interface NavParams {
  sectionId: string;
}

export type OuterProps = NavigationScreenProps<NavParams>;

export type InnerProps = WithSection;
