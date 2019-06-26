import React from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';
import { FinderProps, NamedNodeFinder } from '../named-node-finder';

type Props<QResult, QVars> = WrappedFieldProps & FinderProps<QResult, QVars>;

class NodeFinderComponent<QResult, QVars> extends React.PureComponent<
  Props<QResult, QVars>
> {
  render() {
    const { input, meta, ...props } = this.props;
    const { value, onChange } = input;
    return (
      <NamedNodeFinder<QResult, QVars>
        {...props}
        value={value}
        onChange={onChange}
      />
    );
  }
}

type FieldProps<QResult, QVars> = BaseFieldProps<FinderProps<QResult, QVars>> &
  FinderProps<QResult, QVars>;

export const NodeFinderField = <QResult, QVars>(
  props: FieldProps<QResult, QVars>,
) => {
  const CustomField = Field as new () => GenericField<
    FinderProps<QResult, QVars>
  >;
  return <CustomField {...props} component={NodeFinderComponent} />;
};
