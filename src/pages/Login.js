import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEmail } from '../utils';

import './Login.less';

function Login({ dispatch }) {
  const [sending, setSending] = useState(false);
  const [count, setCount] = useState(60);
  const [isFirst, setFirst] = useState(true);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const timer = useRef(null);
  const history = useHistory();

  useEffect(() => () => {
    window.clearInterval(timer.current);
  }, []);

  const checkEmail = (str) => {
    if (!str) {
      setError('Email is required');
      return false;
    }
    if (!isEmail(str)) {
      setError('Email is invalid');
      return false;
    }
    setError(null);
    return true;
  };
  const sendCode = () => {
    if (!checkEmail(email)) {
      setFirst(false);
      return;
    }
    dispatch({
      type: 'user/sendCode',
      payload: email
    }).then(() => {
      setError(null);
      setSuccess('Please check your email to get code.');
      setSending(true);
      let t = 60;
      timer.current = window.setInterval(() => {
        t--;
        if (t === 0) {
          window.clearInterval(timer.current);
          setSending(false);
        } else {
          setCount(t);
        }
      }, 1000);
    }).catch(() => {
      setSuccess(null);
      setError('Failed to send mail. Please try again.');
    });
  };
  const updateEmail = (str) => {
    if (!isFirst) {
      checkEmail(str);
    }
    setEmail(str);
  };
  const login = () => {
    dispatch({
      type: 'user/login',
      payload: { email, code }
    }).then(() => {
      history.push('/');
    }).catch((e) => {
      setError(e.message);
    });
  };

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
                  onChange={e => updateEmail(e.target.value)}
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
                  onChange={e => setCode(e.target.value)}
                />
                <span className="input-suffix">
                  <button type="button" className="btn btn-lg send-btn" disabled={sending} onClick={sendCode}>
                    {sending ? `${count} s` : 'Send code'}
                  </button>
                </span>
              </div>
            </div>
            <div className="form-item">
              <p>
                <input type="checkbox" readOnly checked />
                I have read and agree to&nbsp;
                <a href="/terms" target="_blank">the terms of use.</a>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              disabled={!(email && code)}
              onClick={login}
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

Login.propTypes = {
  dispatch: PropTypes.any.isRequired
};

export default connect()(Login);
