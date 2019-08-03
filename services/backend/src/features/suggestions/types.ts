import { Node, NodeRef, Section, User } from '@whitewater-guide/commons';

export enum SuggestionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Suggestion extends Node {
  id: string;
  createdAt: string;
  createdBy: User | null;
  status: SuggestionStatus;
  resolvedBy: User | null;
  resolvedAt: string;

  section: Section;
  description: string | null;
  copyright: string | null;
  resolution: number[];
  image: string;
}

export interface SuggestionInput {
  section: NodeRef;
  description: string | null;
  copyright: string | null;
  filename: string | null;
  resolution: number[] | null;
}

export interface SuggestionsFilter {
  status?: SuggestionStatus[];
  userId?: string;
}
