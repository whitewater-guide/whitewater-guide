import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Section } from '@whitewater-guide/commons';
import { LogbookSection } from '@whitewater-guide/logbook-schema';
import { Screens } from '~/core/navigation';
import {
  DescentFormNavProp,
  DescentFormParamsList,
} from '~/screens/descent-form/types';

export const NEW_SECTION = 'new_section';
export const LOADING_ITEM_PREFIX = 'loading';
export const LOADING_RECENT = `${LOADING_ITEM_PREFIX}_recent`;
export const LOADING_LOGBOOK = `${LOADING_ITEM_PREFIX}_logbook`;
export const LOADING_DB = `${LOADING_ITEM_PREFIX}_db`;

export enum SectionType {
  NEW_ITEM = 'NewItem',
  RECENT = 'Recent',
  SEARCH_LOGBOOK = 'SearchLogbook',
  SEARCH_DB = 'SearchDb',
}

export interface NewItemSection {
  id: SectionType.NEW_ITEM;
  data: [{ id: string }];
}

export interface RecentSection {
  id: SectionType.RECENT;
  data: LogbookSection[] | [{ id: string }];
}

export interface SearchLogbookSection {
  id: SectionType.SEARCH_LOGBOOK;
  data: LogbookSection[] | [{ id: string }];
}

export interface SearchDbSection {
  id: SectionType.SEARCH_DB;
  data: Section[] | [{ id: string }];
}

export type SearchData =
  | [NewItemSection, RecentSection]
  | [SearchLogbookSection, SearchDbSection];

export type ItemType = { id: string } | LogbookSection | Section;

export type DescentFormSectionNavProp = CompositeNavigationProp<
  StackNavigationProp<DescentFormParamsList, Screens.DESCENT_FORM_SECTION>,
  DescentFormNavProp
>;

export interface DescentFormSectionNavProps {
  navigation: DescentFormSectionNavProp;
  route: RouteProp<DescentFormParamsList, Screens.DESCENT_FORM_SECTION>;
}
