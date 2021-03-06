import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icon from 'react-feather';

export interface IBottomNavComponentProps {}

export default class BottomNavComponent extends React.Component<IBottomNavComponentProps> {
  public render() {
    return (
      <nav className="bottom-nav">
        <div className="bottom-nav__item">
          <NavLink exact to={'/'} className="bottom-nav__item-link" activeClassName="is-active">
            <Icon.BookOpen />
            Diary
          </NavLink>
        </div>
        <div className="bottom-nav__item">
          <NavLink exact to={'/medication'} className="bottom-nav__item-link" activeClassName="is-active">
            <Icon.Circle />
            Medication
          </NavLink>
        </div>
        <div className="bottom-nav__item">
          <NavLink exact to={'/findings'} className="bottom-nav__item-link" activeClassName="is-active">
            <Icon.Database />
            Findings
          </NavLink>
        </div>
        <div className="bottom-nav__item">
          <NavLink exact to={'/community'} className="bottom-nav__item-link" activeClassName="is-active">
            <Icon.Users />
            Community
          </NavLink>
        </div>
      </nav>
    );
  }
}
