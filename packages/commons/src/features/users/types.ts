import { NamedNode, Timestamped } from '../../core';

export type Role = 'ADMIN' | 'EDITOR' | 'PREMIUM' | 'USER';

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
}

export interface EditorSettings {
  language: string;
}
