import * as React from 'react';

export interface ISettingsPageProps {
  stateCallback(obj: {}): void;
  darkMode: boolean;
  history?: any;
}

export default class SettingsPage extends React.Component<ISettingsPageProps> {
  state = {
    darkMode: this.props.darkMode
  };

  public render() {
    return (
      <div className="settings">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <button type="button" className="btn btn-primary has-gradient has-shadow btn-block btn-lg" onClick={this.toggleDarkMode()}>
                {this.state.darkMode === true ? 'Deactivate' : 'Activate'} Dark Mode
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>
                You are signed in as: <strong>demo@bastion.de</strong>
              </p>
              <button type="button" className="btn btn-primary has-gradient has-shadow btn-block btn-lg" onClick={this.signOut()}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  toggleDarkMode = () => {
    return (e: any) => {
      this.setState({ darkMode: !this.state.darkMode });
      this.props.stateCallback && this.props.stateCallback({ darkMode: !this.state.darkMode });
    };
  };

  signOut = () => {
    return (e: any) => {
      localStorage.removeItem('login');
      this.props.stateCallback && this.props.stateCallback({ loggedIn: false });
      this.props.history.push('/');
    };
  };
}
