import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Upload from '../components/Upload';

import './Home.less';

function Home({ user }) {
  return (
    <div className="home-section">
      {user ? <Upload /> : (
        <div className="home-intro">
          <h3>Sharing Your Files</h3>
          <p>Free &bull; Fast &bull; Secure &bull; Simplicity</p>
          <a href="/login" className="btn btn-primary btn-lg">Start to share</a>
        </div>
      )}
    </div>
  );
}
Home.propTypes = {
  user: PropTypes.any
};
Home.defaultProps = {
  user: null
};

function mapState({ user }) {
  return {
    user: user.info
  };
}

export default connect(mapState)(Home);
