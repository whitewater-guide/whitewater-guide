import { ComponentType } from 'react';
import { branch, ComponentEnhancer, predicate, renderComponent } from 'recompose';

export default <TOuter>(isLoading: predicate<TOuter>, component: ComponentType<any>) => branch<TOuter>(
  isLoading,
  renderComponent(component),
);

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentEnhancer<any, any>;
