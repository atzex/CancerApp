import * as React from 'react';
import LoginPage from './login/loginpage';
import DiaryPage from './modules/diary';
import MedicationPage from './modules/medication';
import FindingsPage from './modules/findings';
import CommunityPage from './modules/community';

import BottomNavComponent from './nav/bottom-nav';
import { Switch, Route } from 'react-router-dom';

export interface IAppProps {}

export default class MainPage extends React.Component<IAppProps> {
  public render() {
    return (
      <div className="App">
        {!localStorage.login && <LoginPage />}
        {localStorage.login === '1' && (
          <div>
            <Switch>
              <Route exact path="/">
                <DiaryPage />
              </Route>
              <Route exact path="/medication">
                <MedicationPage />
              </Route>
              <Route exact path="/findings">
                <FindingsPage />
              </Route>
              <Route exact path="/community">
                <CommunityPage />
              </Route>
            </Switch>
            <BottomNavComponent />
          </div>
        )}
      </div>
    );
  }
}
