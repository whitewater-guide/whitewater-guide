import { stateToMarkdown } from 'draft-js-export-markdown';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
// tslint:disable-next-line:no-submodule-imports
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ReactMarkdown from 'react-markdown';
import PreviewButton from './PreviewButton';
import Prism from './Prism';

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
  wrapperDisabled: {
    display: 'block',
  },
  editor: {
    flex: 1,
    height: 'auto',
  },
  editorDisabled: {
    display: 'none',
  },
};

interface Props {
  value: any;
  onChange: any;
}

interface State {
  previewMode: boolean;
  markdown: string;
}

class DraftEditor extends React.PureComponent<Props, State> {
  state: State = { previewMode: false, markdown: '' };

  onToggleMarkdown = () => {
    const { value } = this.props;
    const previewMode = !this.state.previewMode;
    this.setState({
      previewMode,
      markdown: (value && previewMode) ? stateToMarkdown(value.getCurrentContent()).trim() : '',
    });
  };

  render() {
    const { previewMode, markdown } = this.state;
    const wrapperStyle = previewMode ? styles.wrapperDisabled : styles.wrapper;
    const editorStyle = previewMode ? styles.editorDisabled : styles.editor;
    const markdownStyle = previewMode ? styles.editor : styles.editorDisabled;
    return (
      <React.Fragment>
        <Editor
          toolbar={TOOLBAR}
          wrapperStyle={wrapperStyle}
          editorStyle={editorStyle}
          editorState={this.props.value}
          onEditorStateChange={this.props.onChange}
          toolbarCustomButtons={[<PreviewButton key="md" enabled={previewMode} onToggle={this.onToggleMarkdown} />]}
        />
        <div style={markdownStyle}>
          <Prism>
            {markdown}
          </Prism>
        </div>
      </React.Fragment>
    );
  }
}

export default DraftEditor;
