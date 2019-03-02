// declarations for network debugging

// tslint:disable-next-line:no-namespace
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

interface Window {
  __FETCH_SUPPORT__: any;
}
