import React from 'react';

import './Login.less';

export default function Login() {
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
                <input type="text" autoComplete="off" placeholder="Your Email" className="input" />
              </div>
            </div>
            <div className="form-item">
              <div className="form-control">
                <span className="input-prefix">
                  <i className="icon icon-lock" />
                </span>
                <input type="text" autoComplete="off" placeholder="Security Code" className="input" />
                <span className="input-suffix">
                  <button type="button" className="btn btn-lg">Send code</button>
                </span>
              </div>
            </div>
            <button type="button" className="btn btn-primary btn-lg btn-block">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}
