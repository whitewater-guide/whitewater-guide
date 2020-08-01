import { RawTimestamped } from '~/db';
export interface DescentRaw extends RawTimestamped {
  id: string;
  parent_id: string | null;
  ord_id: number;
  user_id: string;
  section_id: string;
  started_at: Date;

  comment: string | null;
  duration: number | null;
  level_value: number | null;
  level_unit: string | null;
  public: boolean;
}

export interface ShareToken {
  descent: string;
  section: string;
}
