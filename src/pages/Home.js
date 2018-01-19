import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Home.less';

function Home({ user }) {
  return (
    <div className="container">
      {user ? (
        <div className="drop-block">
          <i className="icon icon-upload" />
          <h4>Drop your files here!</h4>
          <p>You can drop multiple files, max 2G each.</p>
        </div>
      ) : (
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
