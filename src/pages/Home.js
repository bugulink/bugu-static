import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Upload from '../components/Upload';
import LinkMaker from '../components/LinkMaker';

import './Home.less';

class Home extends Component {
  static propTypes = {
    user: PropTypes.any
  };

  static defaultProps = {
    user: null
  };

  state = {
    list: null,
    step: 'upload'
  };

  makeLink(list) {
    this.setState({ step: 'link', list });
  }

  sendMail(list) {
    this.setState({ step: 'mail', list });
  }

  render() {
    const { user } = this.props;
    const { step, list } = this.state;
    const child = () => {
      if (!user) {
        return (
          <div className="home-intro">
            <h3>Sharing Your Files</h3>
            <p>Free &bull; Fast &bull; Secure &bull; Simplicity</p>
            <a href="/login" className="btn btn-primary btn-lg">Start to share</a>
          </div>
        );
      }
      if (step === 'upload') {
        return (
          <Upload
            onMake={d => this.makeLink(d)}
            onSend={d => this.sendMail(d)}
          />
        );
      }
      if (step === 'link') {
        return <LinkMaker list={list} onBack={() => this.setState({ step: 'upload' })} />;
      }
      if (step === 'mail') {
        return <div>Mail</div>;
      }
      return null;
    };
    return (
      <div className="home-section">
        {child()}
      </div>
    );
  }
}

function mapState({ user }) {
  return {
    user: user.info
  };
}

export default connect(mapState)(Home);
