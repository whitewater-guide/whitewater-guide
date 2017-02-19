import React, {Component, PropTypes} from 'react';
import Quill from 'react-quill';
import '../../../node_modules/quill/dist/quill.snow.css';

const quillToolbar = [
  [{'header': [1, 2, false]}],
  ['bold', 'italic'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  //['link', 'image', 'video'],
];

const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  //"link", "image", 'video',
];

class RichTextInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);
    this.quillModules = {toolbar: {container: quillToolbar, handlers: {image: this.imageHandler}}};
  }

  render() {
    const value = this.props.field.value === undefined ? '' : this.props.field.value;
    return (
      <div spellCheck={true}>
        <Quill
          ref="quill"
          theme="snow"
          value={value}
          modules={this.quillModules}
          formats={quillFormats}
          style={styles.quill}
          onChange={this.props.field.onChange}
        />
      </div>
    );
  }

  imageHandler = () => {
    const quill = this.refs["quill"].getEditor();
    const range = quill.getSelection();
    const value = prompt('Enter image URL');
    quill.insertEmbed(range.index, 'image', value, 'user');
  };
}

const styles = {
  quill: {
    height: 600,
    marginBottom: 24,
  },
};

export default RichTextInput;