import React from 'react';

console.ignoredYellowBox = [
  'Warning: Stateless function components cannot be given refs',
  'Setting a timer for a long',
];

// if (__DEV__) {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React, { exclude: [/^YellowBox/, 'StaticContainer', '_store'] });
//   if (!console.group) {
//     console.group = console.log;
//     console.groupEnd = console.log;
//   }
// }
