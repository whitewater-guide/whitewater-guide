import { branch, renderComponent } from 'recompose';
import { Loading } from './Loading';

export const withLoading = <TOuter>(isLoading: (props: TOuter) => boolean) =>
  branch<TOuter>(isLoading, renderComponent(Loading));
