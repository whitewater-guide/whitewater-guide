import { ApolloLink, NextLink, Operation } from '@apollo/client/link/core';
import get from 'lodash/get';

export class EditorLanguageLink extends ApolloLink {
  private _language = 'en';

  request(operation: Operation, forward: NextLink) {
    operation.setContext({
      headers: {
        'X-Editor-Language': this._language,
      },
    });
    if (
      operation.operationName === 'myProfile' ||
      operation.operationName === 'updateEditorSettings'
    ) {
      return forward(operation).map((data) => {
        const lang =
          get(data, 'data.me.editorSettings.language') ||
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
