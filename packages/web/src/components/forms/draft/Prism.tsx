// tslint:disable:no-var-requires
require('prismjs');
// tslint:disable-next-line:no-submodule-imports
require('prismjs/components/prism-markdown');
require('./prism.css');

import React from 'react';
import PrismCode from 'react-prism';

interface Props {
  children: string;
}

// see index.html for prism script and css
const Prism: React.SFC<Props> = ({ children }) => (
  <PrismCode component="pre" className="language-markdown">
    {children}
  </PrismCode>
);

export default Prism;
