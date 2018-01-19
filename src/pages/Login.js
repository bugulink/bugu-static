import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'yax-router';
import { isEmail } from '../utils';

import './Login.less';

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.any.isRequired
  }

  state = {
    email: '',
    code: ''
  }

  sendCode() {
    const { dispatch } = this.props;
    const { email } = this.state;
    if (!email) {
      return this.setState({ error: 'Email is required' });
    }
    if (!isEmail(email)) {
      return this.setState({ error: 'Email is invalid' });
    }
    dispatch({
      type: 'user/sendCode',
      payload: email
    }).then(() => {
      this.setState({ success: 'Please check your email to get code.' });
    }).catch(() => {
      this.setState({ error: 'Failed to send mail. Please try again.' });
    });
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
    const { email, code, error, success } = this.state;
    return (
      <div className="container login-container">
        <div className="login-form">
          <div className="main">
            <form className="form login-content">
              <div className="form-item">
                <div className="form-control">
                  <span className="input-prefix">
                    <i className="icon icon-user" />
                  </span>
                  <input
                    type="text"
                    className="input"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
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
                    onChange={(e) => this.setState({ code: e.target.value })}
                  />
                  <span className="input-suffix">
                    <button type="button" className="btn btn-lg" onClick={() => this.sendCode()}>Send code</button>
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                disabled={!Boolean(email && code)}
                onClick={() => this.login()}
              >
                Sign in
              </button>
              {error ? <span className="alert alert-error">{error}</span> : null}
              {success ? <span className="alert alert-success">{success}</span> : null}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default connect()(Login);
