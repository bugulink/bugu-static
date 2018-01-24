import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router';

import './Header.less';

const HomeLink = () => <Link to="/" className="btn"><i className="icon icon-home" /></Link>;
const LoginLink = () => <Link to="/login" className="btn btn-primary">Sign in</Link>;

function Header({ user }) {
  return (
    <div className="header">
      <div className="layout-container clearfix">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="image" />
          </Link>
        </div>
        <div className="header-nav">
          {user ? (
            <div className="user-nav">
              <Link className="nav-link" to="/files">
                <i className="icon icon-files" />
              </Link>
              <Link className="nav-link" to="/links">
                <i className="icon icon-links" />
              </Link>
              <div className="dropdown">
                <div className="user-info">
                  <div className="avatar">{user.email.slice(0, 1).toUpperCase()}</div>
                </div>
                <ul className="dropdown-menu">
                  <li>{user.email}</li>
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
  user: PropTypes.any
};
Header.defaultProps = {
  user: null
};

export default Header;
