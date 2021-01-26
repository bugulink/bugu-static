import React from 'react';
import './Footer.less';

export default function Footer() {
  const year = (new Date()).getFullYear();
  return (
    <div className="footer">
      <div className="container">
        Copyright ©&nbsp;
        {year}
        &nbsp;JSmartX Inc. All Rights Reserved.
        <span className="spliter">|</span>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">沪ICP备18037078号-3</a>
      </div>
    </div>
  );
}
