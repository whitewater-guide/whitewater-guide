import { HostComponent, requireNativeComponent, ViewProps } from 'react-native';

export interface RNSectionItemProps {
  difficulty: string;
  difficultyExtra?: string | null;
  riverName: string;
  sectionName: string;
  rating?: number | null;
  verified?: boolean | null;
  demo?: boolean | null;
  flows?: {
    value: string;
    unit: string;
    fromNow: string;
  } | null;
}

export default requireNativeComponent('RNSectionItem') as HostComponent<
  RNSectionItemProps & ViewProps
>;
