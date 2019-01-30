import { CardHeaderProps } from 'material-ui';
import { CardHeader as MUICardHeader } from 'material-ui/Card';
import muiThemeable from 'material-ui/styles/muiThemeable';
import React from 'react';
import { Styles, Themeable } from '../styles';

const styles: Styles = {
  header: {
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
};

type Props = CardHeaderProps & Themeable;

const CardHeaderView: React.StatelessComponent<Props> = ({
  muiTheme,
  ...props
}) => {
  const backgroundColor = muiTheme.palette!.primary1Color;
  const titleStyle = { ...styles.title, ...props.titleStyle };
  const style = { ...styles.header, backgroundColor, ...props.style };
  return (
    <MUICardHeader {...props} titleStyle={titleStyle} style={style}>
      {props.children}
    </MUICardHeader>
  );
};

export const CardHeader: React.ComponentType<CardHeaderProps> = muiThemeable()(
  CardHeaderView as any,
);
