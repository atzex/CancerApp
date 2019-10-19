import React from 'react';
import MainPage from './component/main';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <MainPage />
    </Router>
  );
};

export default App;
