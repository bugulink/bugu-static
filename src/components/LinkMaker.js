import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from '../utils';
import fetch from '../request';

import './LinkMaker.less';

export default class LinkMaker extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired
  };

  state = {
    link: null,
    status: 'loading'
  };

  componentWillMount() {
    this.makeLink();
  }

  makeLink() {
    const { list } = this.props;
    this.setState({ status: 'loading' });
    fetch.post('/link/add', {
      ids: list.map(f => f.id)
    }).then((res) => {
      this.setState({
        status: 'done',
        link: res.data
      });
    }).catch(() => {
      message.error('Make link failed! Please try again.');
      this.setState({ status: 'failed' });
    });
  }

  back() {
    this.props.onBack();
  }

  render() {
    const { status, link } = this.state;
    const path = `${window.location.protocol}//${window.location.host}/download/`;
    const copy = (e) => {
      e.target.select();
      try {
        const isOk = document.execCommand('copy');
        if (isOk) {
          message.success('Copy success!');
        } else {
          message.error('Copy failed!');
        }
      } catch (err) {
        message.error('Copy failed!');
      }
    };
    const child = () => {
      if (status === 'loading') {
        return (
          <div className="link-body">
            <i className="icon icon-loading loading" />
            <div className="muted">Making link...</div>
          </div>
        );
      }
      if (status === 'failed') {
        return (
          <div className="link-body">
            <i className="icon icon-close-r error" />
            <div className="muted">Make link failed! Please retry.</div>
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
        return (
          <div className="link-body">
            <i className="icon icon-check-r success" />
            <h3>You are done!</h3>
            <div className="muted">Copy your download link and code.</div>
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
