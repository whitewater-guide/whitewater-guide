import { get } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { FieldProps } from './types';

interface Props<ComponentProps, ValueType> {
  name: string;
  title: string;
  component: React.ComponentClass<ComponentProps & FieldProps<ValueType>>;
}

export class Field<ComponentProps, ValueType> extends React.PureComponent<Props<ComponentProps, ValueType>> {

  static contextTypes: any = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  render() {
    const { component, ...props } = this.props;
    const value = get(this.context.formData, this.props.name);
    const error = get(this.context.formErrors, this.props.name);
    const onChange = (v: ValueType) => this.context.formFieldChangeHandler(this.props.name, v);
    const field = { value, error, onChange };
    return React.createElement(component, { ...props, field });
  }
}
