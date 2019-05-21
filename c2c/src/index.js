import React, { Component } from 'react';
import { ReactDom, render, browserHistory} from 'react-dom';
// import {browserHistory} from 'react-router'
import {BrowserRouter as Router} from 'react-router-dom';
import Nav from './components/Nav';
import { getRouters } from './router'
import { Provider } from 'react-redux';
import store from './redux/store';
import '../mock/mock.js';

const root = document.getElementById('app');
render(getRouters(browserHistory), root);