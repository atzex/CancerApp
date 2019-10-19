import * as React from 'react';
import { DateBox, Button } from 'devextreme-react';
import moment from 'moment';
import * as Icon from 'react-feather';
import logo from '../../images/Bastion_Name_Logo.svg';
import logoDarkMode from '../../images/Bastion_Name_W_Logo.svg';
import { NavLink } from 'react-router-dom';

export interface IHeaderComponentProps {
  onDateChange: (value: number) => void;
  darkMode: boolean;
}

export default class HeaderComponent extends React.Component<IHeaderComponentProps> {
  state = {
    current: 0,
    logoType: this.props.darkMode === true ? logoDarkMode : logo
  };

  buttonLeftClick = () => {
    const newDate = moment(this.state.current);
    newDate.subtract(1, 'd');
    this.setDate(newDate.valueOf());
  };
  buttonRightClick = () => {
    const newDate = moment(this.state.current);
    newDate.add(1, 'd');
    this.setDate(newDate.valueOf());
  };

  setDate(newCurrent: number) {
    this.setState({ current: newCurrent });
    this.props.onDateChange && this.props.onDateChange(newCurrent);
  }

  componentDidMount() {
    const today = moment()
      .set('h', 0)
      .set('m', 0)
      .set('s', 0)
      .set('ms', 0);
    this.setDate(today.valueOf());
  }

  componentDidUpdate() {
    if (this.props.darkMode === true && this.state.logoType !== logoDarkMode) {
      this.setState({ logoType: logoDarkMode });
    } else if (this.props.darkMode !== true && this.state.logoType !== logo) {
      this.setState({ logoType: logo });
    }
  }

  public render() {
    return (
      <header className="header">
        <div className="top-bar">
          <div className="top-bar__left">
            <img src={this.state.logoType} className="top-bar__logo" alt="BASTION - A Cancer Management Application" />
          </div>
          <div className="top-bar__right">
            <NavLink exact to={'/settings'} className="top-bar__link" activeClassName="is-active">
              <Icon.Settings size={18} />
            </NavLink>
          </div>
        </div>
        <div className="top-nav">
          <Button className="top-nav__button" onClick={this.buttonLeftClick}>
            <Icon.ChevronLeft />
          </Button>
          {/* <Button>-</Button> */}
          <DateBox value={this.state.current} type={'date'} />
          {/* <Button>+</Button> */}
          <Button className="top-nav__button" onClick={this.buttonRightClick}>
            <Icon.ChevronRight />
          </Button>
        </div>
      </header>
    );
  }
}
