import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router } from 'yax-router';
import { Route, Switch } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Files from './pages/Files';
import Links from './pages/Links';
import Link from './pages/Link';

const Routes = ({ history, user }) => (
  <Router history={history}>
    <div className="main">
      <Header user={user} />
      <div className="main-wrapper">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/files" component={Files} />
          <Route exact path="/links" component={Links} />
          <Route path="/link/:linkId" component={Link} />
        </Switch>
      </div>
      <Footer />
    </div>
  </Router>
);
Routes.propTypes = {
  user: PropTypes.any,
  history: PropTypes.any.isRequired
};
Routes.defaultProps = {
  user: null
};

function mapState({ user }) {
  return {
    user: user.info
  };
}

export default connect(mapState)(Routes);
