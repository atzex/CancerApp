import * as React from 'react';
import HeaderComponent from './header/header';
import LoginPage from './login/loginpage';
import DiaryPage from './modules/diary';
import MedicationPage from './modules/medication';
import FindingsPage from './modules/findings';
import CommunityPage from './modules/community';
import SettingsPage from './modules/settings';

import BottomNavComponent from './nav/bottom-nav';
import { Switch, Route } from 'react-router-dom';

export interface IAppProps {}

export default class MainPage extends React.Component<IAppProps> {
  state = {
    currentDate: 0,
    loggedIn: localStorage.login,
    darkMode: localStorage.darkMode === 'true' ? true : false
  };

  changeDate = (date: number) => {
    this.setState({
      currentDate: date
    });
  };

  componentDidUpdate() {
    let darkMode = localStorage.darkMode === 'true' ? true : false;
    if (darkMode !== this.state.darkMode) {
      localStorage.darkMode = this.state.darkMode;
      if (this.state.darkMode !== true) {
        document.body.classList.remove('dark-mode');
      } else {
        document.body.classList.add('dark-mode');
      }
    }
  }

  public render() {
    return (
      <div className="App">
        {!localStorage.login && <LoginPage stateCallback={this.stateCallback} loggedIn={this.state.loggedIn} />}
        {localStorage.login === '1' && (
          <div>
            <HeaderComponent darkMode={this.state.darkMode} onDateChange={this.changeDate} />
            <Switch>
              <Route exact path="/">
                <DiaryPage currentDate={this.state.currentDate} />
              </Route>
              <Route exact path="/medication">
                <MedicationPage />
              </Route>
              <Route exact path="/findings">
                <FindingsPage currentDate={this.state.currentDate} />
              </Route>
              <Route exact path="/community">
                <CommunityPage />
              </Route>
              <Route
                exact
                path="/settings"
                component={(props: any) => {
                  return <SettingsPage darkMode={this.state.darkMode} stateCallback={this.stateCallback} {...props} />;
                }}
              ></Route>
            </Switch>
            <BottomNavComponent />
          </div>
        )}
      </div>
    );
  }

  stateCallback = (obj: {}): void => {
    this.setState(obj);
  };
}
