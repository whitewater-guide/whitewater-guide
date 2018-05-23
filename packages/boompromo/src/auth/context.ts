import React from 'react';
import { FacebookContext } from './types';

const defaultValue = { loading: true, login: () => {}, logout: () => {} };

const Context = React.createContext<FacebookContext>(defaultValue);

export default Context;
