import { NamedNode, Timestamped } from '../../core';
import { Group } from '../groups';
import { Region } from '../regions';

/**
 * This is graphql type
 */
export interface User extends NamedNode, Timestamped {
  avatar: string | null;
  email: string | null;
  admin: boolean;
  language: string;
  imperial: boolean;
  editorSettings: EditorSettings | null;

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
}
