import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from '../utils';
import Upload from '../components/Upload';
import LinkMaker from '../components/LinkMaker';
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';

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
            <h3>Sharing Your Files</h3>
            <p>Free &bull; Fast &bull; Secure &bull; Simplicity</p>
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
    const change = data => this.setState({ mails: data });
    return (
      <div className="home-section">
        {child()}
        <Modal
          show={showModal}
          title="Send email via bugu.link"
          onClose={() => this.close()}
        >
          <div className="form mail-form">
            <TagInput data={mails} placeholder="Email to" onChange={change} />
            <div className="form-item">
              <div className="form-control">
                <textarea
                  rows="3"
                  value={msg}
                  className="input"
                  placeholder="Message"
                  onChange={e => this.setState({ msg: e.target.value })}
                />
              </div>
            </div>
            <div className="btns">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleSend()}
              >
                Send
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => this.close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
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
