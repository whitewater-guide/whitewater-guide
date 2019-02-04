export interface RivermapSection {
  id: number;
  river: string;
  section: string;
  type: string;
  latstart: number;
  lngstart: number;
  latend: number;
  lngend: number;
  generalGrade: string;
  spotGrades: string;
  country: string;
  url: string;
}

export interface RivermapData {
  data: {
    sections: RivermapSection[];
  };
}
