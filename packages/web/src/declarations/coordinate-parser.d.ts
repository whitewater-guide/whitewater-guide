declare module 'coordinate-parser' {
  export default class Coordinates {
    constructor(value: string)
    getLatitude(): number;
    getLongitude(): number;
  }
}
