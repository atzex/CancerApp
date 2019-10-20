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
    darkMode: localStorage.darkMode === 'true' ? true : false,
    navActive: 0
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
      let tag = document.getElementById('dxtheme');
      if (this.state.darkMode !== true) {
        if (tag) {
          tag.setAttribute('href', 'https://cdn3.devexpress.com/jslib/19.1.7/css/dx.softblue.css');
        }
        document.body.classList.remove('dark-mode');
      } else {
        if (tag) {
          tag.setAttribute('href', 'https://cdn3.devexpress.com/jslib/19.1.7/css/dx.darkviolet.css');
        }
        document.body.classList.add('dark-mode');
      }
    }
  }

  public render() {
    return (
      <div className="App">
        {!localStorage.login && <LoginPage stateCallback={this.stateCallback} loggedIn={this.state.loggedIn} />}
        {localStorage.login === '1' && (
          <React.Fragment>
            <HeaderComponent darkMode={this.state.darkMode} onDateChange={this.changeDate} navActive={this.state.navActive} />
            <Switch>
              <Route exact path="/">
                <DiaryPage
                  currentDate={this.state.currentDate}
                  onMount={() => {
                    this.setState({ navActive: 0 });
                  }}
                />
              </Route>
              <Route exact path="/medication">
                <MedicationPage
                  currentDate={this.state.currentDate}
                  onMount={() => {
                    this.setState({ navActive: 1 });
                  }}
                />
              </Route>
              <Route exact path="/findings">
                <FindingsPage
                  currentDate={this.state.currentDate}
                  onMount={() => {
                    this.setState({ navActive: 0 });
                  }}
                />
              </Route>
              <Route exact path="/community">
                <CommunityPage
                  onMount={() => {
                    this.setState({ navActive: 2 });
                  }}
                />
              </Route>
              <Route
                exact
                path="/settings"
                component={(props: any) => {
                  return (
                    <SettingsPage
                      onMount={() => {
                        if (this.state.navActive === 2) return;
                        this.setState({ navActive: 2 });
                      }}
                      darkMode={this.state.darkMode}
                      stateCallback={this.stateCallback}
                      {...props}
                    />
                  );
                }}
              ></Route>
            </Switch>
            <BottomNavComponent />
          </React.Fragment>
        )}
      </div>
    );
  }

  stateCallback = (obj: {}): void => {
    this.setState(obj);
  };
}
