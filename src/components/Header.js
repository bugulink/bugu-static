import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { humanSize } from '../utils';

import './Header.less';

const HomeLink = () => <Link to="/" className="btn"><i className="icon icon-home" /></Link>;
const LoginLink = () => <Link to="/login" className="btn btn-primary">Sign in</Link>;

function Header({ user, getCapacity }) {
  const { info, visible, capacity } = user;
  const hide = () => {
    getCapacity(false);
    document.removeEventListener('click', hide);
  };
  const show = () => {
    getCapacity(true);
    document.addEventListener('click', hide);
  };
  return (
    <div className="header">
      <div className="layout-container clearfix">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="image" />
          </Link>
        </div>
        <div className="header-nav">
          {info ? (
            <div className="user-nav">
              <NavLink className="nav-link" activeClassName="active" exact to="/">
                <i className="icon icon-home" />
              </NavLink>
              <NavLink className="nav-link" activeClassName="active" exact to="/files">
                <i className="icon icon-files" />
              </NavLink>
              <NavLink className="nav-link" activeClassName="active" exact to="/links">
                <i className="icon icon-links" />
              </NavLink>
              <div className={`nav-link dropdown${visible ? ' active' : ''}`}>
                <div className="user-info" role="button" onClick={show} onKeyPress={show} tabIndex={0}>
                  <div className="avatar">{info.email.slice(0, 1).toUpperCase()}</div>
                  <div className="dropdown-caret" />
                </div>
                <ul className="dropdown-menu">
                  <li className="text">
                    <div className="email">{info.email}</div>
                    <div className="size">
                      {humanSize(capacity.used)}
                      &nbsp;/&nbsp;
                      {humanSize(capacity.total)}
                    </div>
                  </li>
                  <li className="divider" />
                  <li><a href="/logout">Logout</a></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="login">
              <Switch>
                <Route exact path="/" component={LoginLink} />
                <Route exact path="/login" component={HomeLink} />
              </Switch>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.any,
  getCapacity: PropTypes.func
};
Header.defaultProps = {
  user: null,
  getCapacity: () => {}
};

export default Header;
