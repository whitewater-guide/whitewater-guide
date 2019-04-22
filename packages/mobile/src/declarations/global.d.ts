// tslint:disable:no-namespace
import { FetchMock } from 'jest-fetch-mock';

// declarations for network debugging
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

declare const fetch: FetchMock;
declare const fetchMock: FetchMock;
