import Config from 'react-native-config';
import VK from 'react-native-vkontakte-login';

export default () => {
  (console as any).ignoredYellowBox = [
    'Warning: Stateless function components cannot be given refs',
    'Setting a timer for a long',
  ];

  // Listen to network request in react-native-debugger
  // When this is enabled, uploads do not work
  // const g = global as any;
  // g.XMLHttpRequest = g.originalXMLHttpRequest ? g.originalXMLHttpRequest : g.XMLHttpRequest;
  // g.FormData = g.originalFormData ? g.originalFormData : g.FormData;

  VK.initialize(Config.VK_APP_ID);
};
