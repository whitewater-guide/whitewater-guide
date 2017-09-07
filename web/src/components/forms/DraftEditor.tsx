import * as React from 'react';
import { Editor } from 'react-draft-wysiwyg';
// tslint:disable-next-line:no-submodule-imports
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';

const TOOLBAR = {
  options: ['blockType', 'inline', 'list', 'link'],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline'],
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote', 'Code'],
  },
  list: {
    inDropdown: false,
    options: ['unordered', 'ordered'],
  },
  link: {
    inDropdown: false,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_self',
    options: ['link', 'unlink'],
  },
};

const styles = {
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  editor: {
    flex: 1,
    height: 'auto',
  },
};

type Props = WrappedFieldProps;

class DraftEditorComponent extends React.PureComponent<Props> {
  render() {
    return (
      <Editor
        toolbar={TOOLBAR}
        wrapperStyle={styles.wrapper}
        editorStyle={styles.editor}
        editorState={this.props.input.value}
        onEditorStateChange={this.props.input.onChange}
      />
    );
  }
}

type FieldProps = BaseFieldProps<{}>;

export const DraftEditor: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<{}>;
  return (
    <CustomField
      {...props}
      component={DraftEditorComponent}
    />
  );
};
