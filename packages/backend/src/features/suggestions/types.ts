import { SuggestionStatus } from '@whitewater-guide/commons';

export interface SuggestionRaw {
  id: string;
  section_id: string;
  description: string | null;
  copyright: string | null;
  filename: string | null;
  resolution: number[] | null;

  created_at: Date;
  created_by: string | null;
  status: SuggestionStatus;
  resolved_by: string | null;
  resolved_at: Date | null;
}

export interface ImageArgs {
  width?: number;
  height?: number;
}
