import React from 'react';
import { AdminRoute } from '../../layout';
import TagsFormContainer from './TagsFormContainer';

export const TagsRoute: React.StatelessComponent = () => (
  <AdminRoute exact path="/tags" component={TagsFormContainer} />
);
