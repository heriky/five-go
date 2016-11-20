import React,{PropTypes, Component} from 'react' ;
import {render} from 'react-dom';

import './style.scss';
import Game from './components/Game';

const container = document.getElementById('react-app');

render(<Game col={15} row={15}/>, container);

