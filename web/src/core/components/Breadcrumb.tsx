import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export class Breadcrumb extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    link: PropTypes.string,
  };

  render() {
    const {label, link} = this.props;
    if (link)
      return (<Link to={link}>{label}</Link>);
    else
      return (<span>{label}</span>);
  }
}
