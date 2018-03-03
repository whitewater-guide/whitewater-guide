import { ComponentType } from 'react';
import { branch, predicate, renderComponent } from 'recompose';

export default <TOuter>(isLoading: predicate<TOuter>, component: ComponentType<any>) => branch<TOuter>(
  isLoading,
  renderComponent(component),
);
