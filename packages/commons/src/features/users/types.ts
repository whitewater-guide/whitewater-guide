import { NamedNode, Node, TextSearchFilter, Timestamped } from '../../apollo';
import { Group } from '../groups';
import { Region } from '../regions';

/**
 * This is graphql type
 */
export interface User extends NamedNode, Timestamped {
  avatar: string | null;
  email: string | null;
  admin: boolean;
  editor: boolean;
  language: string;
  imperial: boolean;
  verified: boolean;
  editorSettings: EditorSettings | null;
  accounts: SocialMediaAccount[];

  purchasedRegions: Region[];
  purchasedGroups: Group[];
}

export interface EditorSettings {
  language: string;
}

export interface UserInput {
  name?: string;
  avatar?: string | null;
  language?: string;
  imperial?: boolean;
  email?: string | null;
}

export interface UserFilter extends TextSearchFilter {
  editorsOnly?: boolean;
}

export enum SocialMediaProvider {
  FACEBOOK = 'facebook',
}

export interface SocialMediaAccount extends Node {
  provider: SocialMediaProvider;
}
