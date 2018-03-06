import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, copy } from '../utils';
import fetch from '../request';

import './LinkMaker.less';

export default class LinkMaker extends Component {
  static propTypes = {
    msg: PropTypes.string,
    mails: PropTypes.array,
    list: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired
  };

  static defaultProps = {
    mails: null,
    msg: ''
  };

  state = {
    link: null,
    status: 'loading'
  };

  componentWillMount() {
    this.makeLink();
  }

  makeLink() {
    const { list, mails, msg } = this.props;
    this.setState({ status: 'loading' });
    fetch.post('/link/add', {
      ids: list.map(f => f.id),
      receiver: mails,
      message: msg
    }).then((res) => {
      this.setState({
        status: 'done',
        link: res.data
      });
    }).catch(() => {
      const txt = mails ? 'Send email' : 'Make link';
      message.error(`${txt} failed! Please try again.`);
      this.setState({ status: 'failed' });
    });
  }

  back() {
    this.props.onBack();
  }

  render() {
    const { mails } = this.props;
    const { status, link } = this.state;
    const path = `${window.location.protocol}//${window.location.host}/download/`;
    const child = () => {
      if (status === 'loading') {
        const txt = mails ? 'Sending email' : 'Making link';
        return (
          <div className="link-body">
            <i className="icon icon-loading loading" />
            <div className="muted">{txt}...</div>
          </div>
        );
      }
      if (status === 'failed') {
        const txt = mails ? 'Send email' : 'Make link';
        return (
          <div className="link-body">
            <i className="icon icon-close-r error" />
            <div className="muted">{txt} failed! Please retry.</div>
            <div className="btns">
              <button
                className="btn btn-primary"
                onClick={() => this.makeLink()}
              >Retry
              </button>
              <button
                className="btn"
                onClick={() => this.back()}
              >Cancel
              </button>
            </div>
          </div>
        );
      }
      if (status === 'done') {
        const url = `${path}${link.id}`;
        const title = mails ? 'Send email' : 'Make link';
        const txt = mails ? 'You can also share' : 'Copy and share';
        return (
          <div className="link-body">
            <i className="icon icon-check-r success" />
            <h3>{title} success!</h3>
            <div className="muted">{txt} your download link and code.</div>
            <div className="form">
              <div className="form-item">
                <div className="form-control">
                  <input
                    readOnly
                    type="text"
                    name="link"
                    className="input"
                    value={url}
                    onClick={copy}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-control">
                  <input
                    readOnly
                    type="text"
                    name="code"
                    className="input"
                    value={link.code}
                    onClick={copy}
                  />
                </div>
              </div>
            </div>
            <div className="btns">
              <button
                className="btn btn-primary"
                onClick={() => this.back()}
              >Continue
              </button>
            </div>
          </div>
        );
      }
      return null;
    };
    return (
      <div className="link-maker">
        {child()}
      </div>
    );
  }
}
