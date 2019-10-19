import * as React from 'react';
import HeaderComponent from './header/header';
import LoginPage from './login/loginpage';
import DiaryPage from './modules/diary';
import MedicationPage from './modules/medication';
import FindingsPage from './modules/findings';
import CommunityPage from './modules/community';

import BottomNavComponent from './nav/bottom-nav';
import { Switch, Route } from 'react-router-dom';

export interface IAppProps {}

export default class MainPage extends React.Component<IAppProps> {
  state = {
    currentDate: 0
  };
  changeDate = (date: number) => {
    this.setState({
      currentDate: date
    });
  };

  public render() {
    return (
      <div className="App">
        {!localStorage.login && <LoginPage />}
        {localStorage.login === '1' && (
          <div>
            <HeaderComponent onDateChange={this.changeDate} />
            <Switch>
              <Route exact path="/">
                <DiaryPage currentDate={this.state.currentDate} />
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
