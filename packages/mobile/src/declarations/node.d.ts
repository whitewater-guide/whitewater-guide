/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace NodeJS {
  export interface Global {
    XMLHttpRequest: any;
    originalXMLHttpRequest: any;
    FormData: any;
    originalFormData: any;
    Blob: any;
    originalBlob: any;
    FileReader: any;
    originalFileReader: any;
  }
}
