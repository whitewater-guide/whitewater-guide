import type { FlowsThumbData } from '@/components/flows-thumb';
import type { NavigatePoint } from '@/components/navigate-button';

export interface ListedSectionRiver {
  id: string;
  name: string;
}

export interface ListedSection {
  id: string;
  name: string;
  difficulty: number;
  difficultyXtra?: string | null;
  rating?: number | null;
  verified?: boolean | null;
  favorite?: boolean | null;
  river: ListedSectionRiver;
  putIn: NavigatePoint;
  takeOut: NavigatePoint;
  flowsThumb?: FlowsThumbData;
}
