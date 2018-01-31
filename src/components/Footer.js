import React from 'react';
import './Footer.less';
import pay1 from '../assets/pay1.jpg';
import pay2 from '../assets/pay2.jpg';

export default function Footer() {
  const year = (new Date()).getFullYear();
  return (
    <div className="footer">
      <div className="donate">
        <h3>Buy Me A Coffee</h3>
        <p>If you like BuguLink, consider supporting us via Alipay or Wechat.</p>
        <p>
          <img src={pay1} alt="Alipay" />
          <img src={pay2} alt="Wechat" />
        </p>
      </div>
      <div className="container">Copyright © {year} BuguLink. All Rights Reserved.</div>
    </div>
  );
}
