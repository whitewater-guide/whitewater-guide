import { RouteComponentProps } from 'react-router';
import { withProps } from 'recompose';

export interface WithLanguage {
  language: string;
  onLanguageChange: (language: string) => void;
}

export const withLanguage = withProps<WithLanguage, RouteComponentProps<any>>(({ history }) => ({
  language: (new URLSearchParams(history.location.search)).get('language') || 'en',
  onLanguageChange: (language: string) => {
    const search = new URLSearchParams(history.location.search);
    search.set('language', language);
    history.replace({
      ...history.location,
      search: search.toString(),
    });
  },
}));
