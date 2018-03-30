import { actionCreatorFactory, AnyAction, isType } from 'typescript-fsa';

const actionFactory = actionCreatorFactory();

export const changeEditorLanguage = actionFactory<string>('CHANGE_EDITOR_LANGUAGE');

export type EditorLanguageState = string;

const initialState: EditorLanguageState = 'en';

export const editorLanguageReducer = (state = initialState, action: AnyAction) => {
  if (isType(action, changeEditorLanguage)) {
    return action.payload;
  }
  return state;
};
