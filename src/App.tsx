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
    document.body.classList.add('dark-mode');
  }

  return (
    <Router>
      <MainPage />
    </Router>
  );
};

export default App;
