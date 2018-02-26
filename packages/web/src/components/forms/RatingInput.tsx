import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { Styles } from '../../styles';
import { Rating as RatingRaw } from '../Rating';

const styles: Styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
};

interface OwnProps {
  title?: string;
}

type Props = Partial<WrappedFieldProps> & OwnProps;

export const RatingComponent: React.StatelessComponent<Props> = ({ input, meta, title }) => (
  <div style={styles.wrapper}>
    <span>{title}</span>
    <RatingRaw
      value={input!.value}
      onChange={input!.onChange}
    />
  </div>
);

type FieldProps = BaseFieldProps<OwnProps> & OwnProps;

export const RatingInput: React.StatelessComponent<FieldProps> = props => {
  const CustomField = Field as new () => GenericField<OwnProps>;
  return (
    <CustomField {...props} component={RatingComponent} />
  );
};
