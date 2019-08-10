import {
  WithNode,
  WithRegion,
  WithSearchTerms,
} from '@whitewater-guide/clients';
import { Region, Section } from '@whitewater-guide/commons';
import { ApolloClient } from 'apollo-client';
import { NavigationScreenProps } from 'react-navigation';

export interface ScreenProps {
  region: WithNode<Region | null>;
  sections: Section[];
  updateSections: () => Promise<any>;
  sectionsStatus: SectionsStatus;
}

export interface NavParams {
  regionId: string;
}

export enum SectionsStatus {
  LOADING,
  LOADING_UPDATES,
  READY,
}

export interface ConnectivityProps {
  isConnected: boolean;
}

export type OuterProps = NavigationScreenProps<NavParams> & WithRegion;

export type InnerProps = OuterProps &
  ConnectivityProps & { client: ApolloClient<any> } & WithSearchTerms;

export interface InnerState {
  sections: Section[];
  count: number;
  status: SectionsStatus;
}

export interface RenderProps extends InnerState {
  refresh: () => Promise<void>;
}
