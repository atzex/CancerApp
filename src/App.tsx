import React from 'react';
import MainPage from './component/main';
import { BrowserRouter as Router } from 'react-router-dom';
import config from 'devextreme/core/config';

config({
  floatingActionButtonConfig: {
    position: {
      at: 'right bottom',
      my: 'right bottom',
      offset: '-27 -90'
    }
  }
});

const App: React.FC = () => {
  if (localStorage.darkMode === 'true') {
    let tag = document.getElementById('dxtheme');
    if (tag) {
      tag.setAttribute('href', 'https://cdn3.devexpress.com/jslib/19.1.7/css/dx.darkviolet.css');
    }
    document.body.classList.add('dark-mode');
  }

  return (
    <Router>
      <MainPage />
    </Router>
  );
};

export default App;
