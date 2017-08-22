import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  label: string;
  link: string;
}

export const Breadcrumb: React.StatelessComponent<Props> = ({ label, link }) => (
  link ? <Link to={link}>{label}</Link> : <span>{label}</span>
);
