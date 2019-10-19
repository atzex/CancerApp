import React from 'react';
import ReactDOM from 'react-dom';
import './scss/app.scss';
import App from './App';

import bless from 'backendless';

const APP_ID = 'EF381AE8-F118-CF0F-FF20-6278175AE300';
const API_KEY = '70789461-85F7-8742-FFEB-D1803BECC900';
bless.serverURL = 'https://api.backendless.com';
bless.initApp(APP_ID, API_KEY);

ReactDOM.render(<App />, document.getElementById('root'));
