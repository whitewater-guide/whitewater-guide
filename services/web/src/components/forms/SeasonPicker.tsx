import times from 'lodash/times';
import xor from 'lodash/xor';
import EnhancedButton from 'material-ui/internal/EnhancedButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import moment from 'moment';
import React, { CSSProperties } from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';
import { Styles, Themeable } from '../../styles';

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    overflow: 'hidden',
  },
  month: {
    display: 'flex',
    flex: 1,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    paddingTop: 16,
    paddingLeft: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  halfButton: {
    flex: 1,
    flexShrink: 0,
    height: 48,
  },
};

interface OwnProps {
  title?: string;
}

type Props = WrappedFieldProps & OwnProps;

class SeasonPickerComponent extends React.PureComponent<Props & Themeable> {
  renderMonth = (monthNumber: number) => {
    const borderStyle: CSSProperties =
      monthNumber === 11
        ? {}
        : {
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: this.props.muiTheme.palette!.borderColor,
          };
    const style = {
      ...styles.month,
      ...borderStyle,
      backgroundColor: this.props.muiTheme.palette!.accent2Color,
    };
    return (
      <div key={`month${monthNumber}`} style={style}>
        {moment()
          .month(monthNumber)
          .format('MMMM')}
      </div>
    );
  };

  renderHalfMonth = (index: number) => {
    const value = this.props.input.value || [];
    const selected = value.includes(index);
    let style = selected
      ? {
          ...styles.month,
          backgroundColor: this.props.muiTheme.palette!.primary1Color,
        }
      : styles.month;
    const borderStyle: CSSProperties =
      index === 23 || index % 2 === 0
        ? {}
        : {
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: this.props.muiTheme.palette!.borderColor,
          };
    style = { ...style, ...borderStyle };
    const onClick = () => this.onToggle(index);
    return (
      <div key={`half${index}`} style={style}>
        <EnhancedButton style={styles.halfButton} onClick={onClick}>
          {selected ? 'X' : 'O'}
        </EnhancedButton>
      </div>
    );
  };

  onToggle = (index: number) => {
    const { onChange, value = [] } = this.props.input;
    if (onChange) {
      onChange(xor(value, [index]).sort((a, b) => a - b));
    }
  };

  render() {
    const rowStyle: CSSProperties = {
      ...styles.row,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: this.props.muiTheme.palette!.borderColor,
    };
    return (
      <div style={styles.container}>
        {this.props.title && <h2 style={styles.title}>{this.props.title}</h2>}
        <div style={rowStyle}>{times(12, this.renderMonth)}</div>
        <div style={rowStyle}>{times(24, this.renderHalfMonth)}</div>
      </div>
    );
  }
}

const SeasonPickerThemeable: React.ComponentType<Props> = muiThemeable()(
  SeasonPickerComponent as any,
);

type FieldProps = BaseFieldProps<OwnProps> & OwnProps;

const CustomField = Field as new () => GenericField<OwnProps>;

export const SeasonPicker: React.StatelessComponent<FieldProps> = (props) => {
  return <CustomField {...props} component={SeasonPickerThemeable} />;
};
