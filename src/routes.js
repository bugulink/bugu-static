import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Files from './pages/Files';
import Links from './pages/Links';
import Link from './pages/Link';

const Routes = ({ user, dispatch }) => (
  <Router>
    <div className="main">
      <Header
        user={user}
        getCapacity={show => dispatch({ type: 'user/getCapacity', payload: show })}
      />
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
  dispatch: PropTypes.func.isRequired
};
Routes.defaultProps = {
  user: null
};

function mapState({ user }) {
  return { user };
}

export default connect(mapState)(Routes);
