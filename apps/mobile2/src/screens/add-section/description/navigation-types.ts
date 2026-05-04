import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

import type { Screens } from '../../../core/navigation';
import type {
  AddSectionTabsParamsList,
  AddSectionTabsScreenProps,
} from '../navigation-types';

export type DescriptionScreenProps = CompositeScreenProps<
  MaterialTopTabScreenProps<
    AddSectionTabsParamsList,
    typeof Screens.ADD_SECTION_DESCRIPTION
  >,
  AddSectionTabsScreenProps
>;
