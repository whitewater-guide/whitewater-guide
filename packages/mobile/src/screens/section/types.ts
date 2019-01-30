import { WithNode, WithSection } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import { NavigationScreenProps } from 'react-navigation';

export interface ScreenProps {
  section: WithNode<Section | null>;
}

export interface NavParams {
  sectionId: string;
}

export type OuterProps = NavigationScreenProps<NavParams>;

export type InnerProps = WithSection;
