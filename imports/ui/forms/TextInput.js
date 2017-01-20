import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import {strToFloat} from '../../utils/TextUtils';

class TextInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    type: PropTypes.string,
  };

  constructor(props){
    super(props);
    this.state = {
      value: String(props.field.value || ''),
    };
  }

  componentWillReceiveProps(nextProps){
    const nextVal = nextProps.field.value;
    if (nextProps.type === 'number' && strToFloat(nextVal) !== strToFloat(this.state.value)){
      const value = isNaN(nextVal) ? '' : String(nextVal);
      this.setState({value});
    }
  }

  render() {
    const {type, field, title} = this.props;
    const numericProps = type === 'number' ? {pattern: '[0-9]+([\,|\.][0-9]+)?'} : {type};
    return (
      <TextField
        style={style}
        value={this.state.value}
        errorText={field.error}
        onChange={this.onChange}
        hintText={title}
        floatingLabelText={title}
        {...numericProps}
      />
    );
  }

  onChange = (e, value) => {
    this.setState({value});
    const castValue = this.props.type === 'number' ? strToFloat(value) : value;
    this.props.field.onChange(castValue);
  }
}

const style = {
  width: '100%',
};

export default TextInput;