import { getStorybookUI, configure } from '@kadira/react-native-storybook';
import { NativeModules } from 'react-native';
import url from 'url';
import './addons';

// import your stories
configure(() => require('./stories'), module);

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

export default getStorybookUI({ port: 7007, host: hostname });
