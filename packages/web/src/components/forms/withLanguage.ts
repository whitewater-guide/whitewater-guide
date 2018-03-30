import { connect } from 'react-redux';
import { changeEditorLanguage, RootState } from '../../redux';

interface StateProps {
  language: string;
}

interface DispatchProps {
  onLanguageChange: (language: string) => void;
}

export type WithLanguage = StateProps & DispatchProps;

export const withLanguage = connect<StateProps, DispatchProps>(
  (state: RootState) => ({ language: state.editorLanguage }),
  { onLanguageChange: changeEditorLanguage },
);
