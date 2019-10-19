import * as React from 'react';
import logo from '../../images/Bastion_CPL_W_Logo.svg';
import * as Icon from 'react-feather';

export interface ILoginPageProps {
  loggedIn: string;
  stateCallback(obj: {}): void;
}

export default class LoginPage extends React.Component<ILoginPageProps> {
  state = {
    loggedIn: this.props.loggedIn,
    loginError: false,
    loginErrorMsg: null
  };

  ref = {
    emailRef: React.createRef<HTMLInputElement>(),
    passwordRef: React.createRef<HTMLInputElement>()
  };

  public render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex">
              <img src={logo} alt="BASTION - A Cancer Management Application" className="login__logo" />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-12">
              <label className="sr-only" htmlFor="email">
                E-Mail
              </label>
              <input type="email" ref={this.ref.emailRef} className="form-control" id="email" name="email" onKeyDown={this.handleKeyDown()} placeholder="E-Mail" />
              <Icon.Mail />
            </div>
            <div className="form-group col-12">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                ref={this.ref.passwordRef}
                className="form-control"
                id="password"
                name="password"
                onKeyDown={this.handleKeyDown()}
                placeholder="Password"
              />
              <Icon.Key />
            </div>
            {this.state.loginError && this.state.loginErrorMsg && <LoginError message={this.state.loginErrorMsg} />}
            <div className="col-12">
              <button type="button" className="btn btn-primary has-gradient has-shadow btn-block btn-lg" onClick={this.tryLogin()}>
                Sign In
              </button>
            </div>
          </div>
        </div>
        <LoginBottomBar />
      </div>
    );
  }

  handleKeyDown() {
    return (e: any) => {
      if (e && e.key === 'Enter') {
        this.tryLogin()();
      } else {
        return;
      }
    };
  }

  tryLogin() {
    return () => {
      if (this.ref.emailRef.current && this.ref.passwordRef.current) {
        let email = this.ref.emailRef.current.value;
        let password = this.ref.passwordRef.current.value;

        if (email.length && this.validateEmail(email) && password.length) {
          localStorage.login = '1';
          this.setState({ loginError: false, loginErrorMsg: null });
          this.props.stateCallback({ loggedIn: 1 });
        } else {
          this.setState({ loginError: true, loginErrorMsg: 'Login incorrect' });
        }
      }
    };
  }

  validateEmail(email: string) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

const LoginBottomBar = () => {
  return (
    <nav className="login-nav">
      <div className="login-nav__item">
        <a href="#sign-up" className="login-nav__item-link">
          Sign Up
        </a>
      </div>
      <div className="login-nav__item">
        <a href="#lost-credentials" className="login-nav__item-link">
          Lost Credentials
        </a>
      </div>
    </nav>
  );
};

const LoginError = (props: any) => {
  if (!props) return null;
  return (
    <div className="col-12">
      <p className="alert alert-danger">Login incorrect.</p>
    </div>
  );
};
