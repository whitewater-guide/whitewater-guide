import { ApolloLink, NextLink, Operation } from 'apollo-link';
import get from 'lodash/get';

export class EditorLanguageLink extends ApolloLink {
  // tslint:disable-next-line:no-inferrable-types
  private _language: string = 'en';

  request(operation: Operation, forward: NextLink) {
    operation.setContext({
      headers: {
        'X-Editor-Language': this._language,
      },
    });
    if (operation.operationName === 'myProfile' || operation.operationName === 'updateEditorSettings') {
      return forward(operation).map((data) => {
        const lang = get(data, 'data.me.editorSettings.language') ||
          get(data, 'data.updateEditorSettings.editorSettings.language');
        if (lang) {
          this._language = lang;
        }
        return data;
      });
    }
    return forward(operation);
  }
}
