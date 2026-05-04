import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

import type { Screens } from '../../../core/navigation';
import type {
  SectionScreenProps,
  SectionTabsParamsList,
} from '../navigation-types';

export type SectionMapScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SectionTabsParamsList, typeof Screens.SECTION_MAP>,
  SectionScreenProps
>;
