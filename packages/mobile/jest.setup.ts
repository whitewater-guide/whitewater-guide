import 'react-native-mock-render/mock';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jsdom from 'jsdom';

function setUpDomEnvironment() {
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
  const { window } = dom;

  (global as any).window = window;
  (global as any).document = window.document;
  (global as any).navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
}

function copyProps(src: any, target: any) {
  const props: any = Object.getOwnPropertyNames(src)
    .filter((prop: string) => typeof target[prop] === 'undefined')
    .map((prop: string) => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

setUpDomEnvironment();

Enzyme.configure({ adapter: new Adapter() });
