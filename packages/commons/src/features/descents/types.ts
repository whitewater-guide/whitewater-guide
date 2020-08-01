import { Timestamped, PageInfo } from '../../apollo';
import { Section } from '../sections';
import { User } from '../users';

export interface DescentLevel {
  __typename?: 'Level';
  unit?: string | null;
  value?: number | null;
}

export interface DescentLevelInput {
  unit?: string | null;
  value: number;
}

export interface Descent extends Timestamped {
  __typename?: 'Descent';
  id: string;
  user: User;
  section: Section;
  startedAt: string;
  duration?: number | null;
  level?: DescentLevel | null;
  comment?: string | null;
  public?: boolean | null;
}

export interface DescentEdge<TCursor = any> {
  __typename?: 'DescentEdge';
  node: Descent;
  cursor: TCursor;
}

export interface DescentInput {
  id?: string | null;

  sectionId: string;
  startedAt: string;
  duration?: number | null;
  level?: DescentLevelInput | null;
  comment?: string | null;
  public?: boolean | null;
}

export interface DescentsConnection<TCursor = any> {
  __typename?: 'DescentsConnection';
  edges: DescentEdge[];
  pageInfo: PageInfo<TCursor>;
}

export interface DescentsFilter {
  startDate?: string | null;
  endDate?: string | null;
  difficulty?: [number, number] | null;
  userId?: string | null;
  sectionId?: string | null;
  sectionName?: string | null;
}
