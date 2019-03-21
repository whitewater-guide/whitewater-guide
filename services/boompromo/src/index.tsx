import { configure } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import JssRoot from './JssRoot';

configure({ enforceActions: 'observed' });

ReactDOM.render(<JssRoot />, document.getElementById('root') as HTMLElement);
