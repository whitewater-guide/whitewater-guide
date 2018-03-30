export type EditorLanguageState = string;

const initialState: EditorLanguageState = 'en';

export const editorLanguageReducer = (state = initialState, action) => {
  return state;
};
