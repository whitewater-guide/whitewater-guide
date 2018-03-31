import { NamedNode, Timestamped } from '../../core';

export enum Role {
  USER = 1,
  ADMIN = 2,
  SUPERADMIN = 3,
}

/**
 * This is graphql type
 */
export interface User extends NamedNode, Timestamped {
  avatar: string | null;
  email: string | null;
  role: Role;
  language: string;
  imperial: boolean;
  editorSettings: EditorSettings | null;
}

export interface EditorSettings {
  language: string;
}
