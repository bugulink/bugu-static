import React from 'react';
import PropTypes from 'prop-types';

import './Modal.less';

function Modal({
  title, children, show, onClose
}) {
  return (
    <div className={show ? 'modal show' : 'modal'}>
      <div className="modal-dialog">
        <div className="modal-content">
          <button type="button" className="modal-close" onClick={e => onClose(e)}>
            <i className="icon icon-close" />
          </button>
          <div className="modal-header">{title}</div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

export default Modal;
