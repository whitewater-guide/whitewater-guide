import React from 'react';
import { Route } from 'react-router';

import SuggestionsMain from './SuggestionsMain';

const SuggestionsRoute: React.FC = () => (
  <Route exact path="/suggestions" component={SuggestionsMain} />
);

export default SuggestionsRoute;
