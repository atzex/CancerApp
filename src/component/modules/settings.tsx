import * as React from 'react';

export interface ISettingsPageProps {
  stateCallback(obj: {}): void;
  darkMode: boolean;
  history?: any;
  onMount?: () => void;
}

export default class SettingsPage extends React.Component<ISettingsPageProps> {
  state = {
    darkMode: this.props.darkMode
  };

  loginEmail = localStorage.loginEmail ? localStorage.loginEmail : 'demo@bastion.de';

  componentDidMount() {
    this.props.onMount && this.props.onMount();
  }

  public render() {
    return (
      <div className="settings">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Your selected language:</p>
              <select className="form-control" defaultValue="0" id="inputGroupSelect01">
                <option selected value="0">
                  English
                </option>
                <option value="1">German</option>
                <option value="2">French</option>
                <option value="3">Chinese</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>Accessability & Energy</p>
              <button type="button" className="btn btn-primary has-gradient has-shadow btn-block btn-lg" onClick={this.toggleDarkMode}>
                {this.state.darkMode === true ? 'Deactivate' : 'Activate'} Dark Mode
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <p>
                You are signed in as: <strong>{this.loginEmail}</strong>
              </p>
              <button type="button" className="btn btn-primary has-gradient has-shadow btn-block btn-lg" onClick={this.signOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
    this.props.stateCallback && this.props.stateCallback({ darkMode: !this.state.darkMode });
  };

  signOut = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('loginEmail');
    this.props.stateCallback && this.props.stateCallback({ loggedIn: false });
    this.props.history.push('/');
  };
}
