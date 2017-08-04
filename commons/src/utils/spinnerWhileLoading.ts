import { branch, renderComponent } from 'recompose';

export default (isLoading, component) => branch(
  isLoading,
  renderComponent(component),
);
