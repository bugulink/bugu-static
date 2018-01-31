import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from '../utils';
import Upload from '../components/Upload';
import LinkMaker from '../components/LinkMaker';
import MailModal from '../components/MailModal';

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
    step: 'upload',
    showModal: false,
    mails: [],
    msg: ''
  };

  makeLink(list) {
    this.setState({ step: 'link', list });
  }

  sendMail(list) {
    this.setState({ showModal: true, list });
  }

  close() {
    this.setState({ showModal: false });
  }

  back() {
    this.setState({
      step: 'upload',
      mails: [],
      msg: ''
    });
  }

  handleSend() {
    const { mails } = this.state;
    if (mails.length === 0) {
      message.error('At least 1 people!');
      return;
    }
    if (mails.length > 20) {
      message.error('Up to 20 people!');
      return;
    }
    this.setState({
      step: 'mail',
      showModal: false
    });
  }

  render() {
    const { user } = this.props;
    const {
      step, list, showModal, mails, msg
    } = this.state;
    const child = () => {
      if (!user) {
        return (
          <div className="home-intro">
            <h3>Share Your Files</h3>
            <p>Free<span>&bull;</span>Fast<span>&bull;</span>Secure<span>&bull;</span>Simple</p>
            <a href="/login" className="btn btn-primary btn-lg">Start to share</a>
          </div>
        );
      }
      if (step === 'upload') {
        return (
          <Upload
            onMake={data => this.makeLink(data)}
            onSend={data => this.sendMail(data)}
          />
        );
      }
      if (step === 'link') {
        return (
          <LinkMaker
            list={list}
            onBack={() => this.back()}
          />
        );
      }
      if (step === 'mail') {
        return (
          <LinkMaker
            list={list}
            mails={mails}
            msg={msg}
            onBack={() => this.back()}
          />
        );
      }
      return null;
    };
    return (
      <div className="home-section">
        {child()}
        <MailModal
          show={showModal}
          mailto={mails}
          text={msg}
          onClose={() => this.close()}
          onSubmit={() => this.handleSend()}
          onChangeMail={data => this.setState({ mails: data })}
          onChangeText={text => this.setState({ msg: text })}
        />
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
