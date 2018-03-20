import React from 'react';
import { PrivateRoute } from '../../layout';
import TagsFormContainer from './TagsFormContainer';

export const TagsRoute: React.StatelessComponent = () => (
  <PrivateRoute exact path="/tags" component={TagsFormContainer} />
);
