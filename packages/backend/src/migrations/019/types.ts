export interface Link {
  next: string;
  related: string;
}

export interface Meta {
  link: Link;
  mediatype: string;
}

export interface Grade {
  text: string;
  value: number;
  max: string | null;
}

export interface Position {
  type: string;
  lat: number;
  lng: number;
}

export interface Putin {
  type: 'putin';
  lat: number;
  lng: number;
}

export interface Takeout {
  type: 'takeout';
  lat: number;
  lng: number;
}

export interface RainchasersRiver {
  uuid: string;
  url: string;
  slug: string;
  river: string;
  section: string;
  km: number;
  grade: Grade;
  desc: string;
  directions: string;
  position: Position[];
  putin: Putin;
  takeout: Takeout;

  // Assigned later
  source?: Source;
  calibration?: Calibration | [];
}

export interface RiversRoot {
  status: number;
  meta: Meta;
  data: RainchasersRiver[];
}

export interface Source {
  type: string;
  name: string;
  url: string;
}

export interface Calibration {
  low?: number;
  medium?: number;
  high?: number;
  huge?: number;
}

export interface History {
  time: number;
  value: number;
}

export interface LevelData {
  river: RainchasersRiver;
  source: Source;
  calibration: Calibration;
  history: History[];
}

export interface LevelRoot {
  status: number;
  meta: Meta;
  data: LevelData;
}
