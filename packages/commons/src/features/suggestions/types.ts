import { NamedNode, Node, NodeRef } from '../../apollo';
import { Section, SectionInput } from '../sections';
import { User } from '../users';

export enum SuggestionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface SuggestionMeta {
  createdAt: string;
  createdBy: User | null;
  status: SuggestionStatus;
  resolvedBy: User | null;
  resolvedAt: string;
}

export interface SuggestionCore extends Node {
  section: Section;
  description: string | null;
  copyright: string | null;
  resolution: number[];
  image: string;
}

export type Suggestion = SuggestionCore & SuggestionMeta;

export interface SuggestionInput {
  section: NodeRef;
  description: string | null;
  copyright: string | null;
  filename: string | null;
  resolution: number[] | null;
}

export interface SuggestedSection<SectionType = string> extends Node {
  createdAt: string;
  createdBy: User | null;
  status: SuggestionStatus;
  region: NamedNode;
  river: NamedNode;
  name: string;
  section: SectionType;
}

export interface SuggestionsFilter {
  status?: SuggestionStatus[];
  userId?: string;
}
