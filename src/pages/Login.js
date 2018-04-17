import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'yax-router';
import { isEmail } from '../utils';

import './Login.less';

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.any.isRequired
  };

  state = {
    sending: false,
    count: 60,
    isFirst: true,
    email: '',
    code: ''
  };

  sendCode() {
    const { dispatch } = this.props;
    const { email } = this.state;
    if (!this.checkEmail(email)) {
      return this.setState({ isFirst: false });
    }
    return dispatch({
      type: 'user/sendCode',
      payload: email
    }).then(() => {
      this.setState({ success: 'Please check your email to get code.', sending: true });
      let count = 60;
      const timer = window.setInterval(() => {
        count--;
        if (count === 0) {
          this.timer = null;
          window.clearInterval(timer);
          this.setState({ sending: false });
        } else {
          this.setState({ count });
        }
      }, 1000);
      this.timer = timer;
    }).catch(() => {
      this.setState({ error: 'Failed to send mail. Please try again.' });
    });
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  checkEmail(email) {
    if (!email) {
      this.setState({ error: 'Email is required' });
      return false;
    }
    if (!isEmail(email)) {
      this.setState({ error: 'Email is invalid' });
      return false;
    }
    this.setState({ error: null });
    return true;
  }

  updateEmail(email) {
    const { isFirst } = this.state;
    if (!isFirst) {
      this.checkEmail(email);
    }
    this.setState({ email });
  }

  login() {
    const { dispatch } = this.props;
    const { email, code } = this.state;
    dispatch({
      type: 'user/login',
      payload: { email, code }
    }).then(() => {
      dispatch(push('/'));
    }).catch((e) => {
      this.setState({ error: e.message });
    });
  }

  render() {
    const {
      email, code, error, success, sending, count
    } = this.state;
    return (
      <div className="login-section">
        <div className="login-form">
          <div className="main">
            <form className="form login-content">
              <div className="form-item">
                <div className="form-control">
                  <span className="input-prefix">
                    <i className="icon icon-user" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="Your Email"
                    value={email}
                    onChange={e => this.updateEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-item">
                <div className="form-control">
                  <span className="input-prefix">
                    <i className="icon icon-lock" />
                  </span>
                  <input
                    type="text"
                    className="input"
                    placeholder="Security Code"
                    value={code}
                    onChange={e => this.setState({ code: e.target.value })}
                  />
                  <span className="input-suffix">
                    <button type="button" className="btn btn-lg send-btn" disabled={sending} onClick={() => this.sendCode()}>
                      {sending ? `${count} s` : 'Send code'}
                    </button>
                  </span>
                </div>
              </div>
              <div className="form-item">
                <p>
                  <input type="checkbox" checked />
                  I have read and agree to <a href="/terms" target="_blank">the terms of use.</a>
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                disabled={!(email && code)}
                onClick={() => this.login()}
              >
                Sign in
              </button>
              {error ? <div className="alert alert-error">{error}</div> : null}
              {success ? <div className="alert alert-success">{success}</div> : null}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default connect()(Login);
