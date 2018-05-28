import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

export class EditorLanguageLink {
  // tslint:disable-next-line:no-inferrable-types
  public language: string = 'en';

  public link: ApolloLink = setContext(() => ({
    headers: {
      'X-Editor-Language': this.language,
    },
  }));

  public onLanguageChange = (value: string) => {
    this.language = value;
  }
}
