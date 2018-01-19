import React from 'react';
import './Footer.less';

export default function Footer() {
  const year = (new Date()).getFullYear();
  return (
    <div className="footer">
      <div className="container">Copyright © {year} BuguLink. All Rights Reserved.</div>
    </div>
  );
}
