import { MdEditor } from '@whitewater-guide/md-editor';
import { MuiThemeProvider } from 'material-ui/styles';
import muiThemeable from 'material-ui/styles/muiThemeable';
import React from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';

type MuiThemeProviderProps = MuiThemeProvider['props'];
type Props = WrappedFieldProps & MuiThemeProviderProps;

class TextareaComponent extends React.PureComponent<Props> {
  render() {
    const toolbarProps: any = {
      style: {
        backgroundColor: '#FFFFFF',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: this.props.muiTheme!.palette!.borderColor,
      },
    };
    return (
      <MdEditor
        value={this.props.input.value}
        onChange={this.props.input.onChange}
        toolbarProps={toolbarProps}
      />
    );
  }
}

const ThemedTextearea = muiThemeable()(TextareaComponent as any);

type FieldProps = BaseFieldProps<{}>;

export const TextareaField: React.FC<FieldProps> = (props) => {
  const CustomField = Field as new () => GenericField<{}>;
  return <CustomField {...props} component={ThemedTextearea} />;
};
