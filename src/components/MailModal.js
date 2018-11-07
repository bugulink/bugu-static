import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import TagInput from './TagInput';

import './MailModal.less';

function MailModal({
  mailto, text, show, onClose, onChangeMail, onChangeText, onSubmit
}) {
  return (
    <Modal
      show={show}
      title="Send email via bugu.link"
      onClose={onClose}
    >
      <div className="form mail-form">
        <TagInput value={mailto} placeholder="Email to" onChange={onChangeMail} />
        <div className="form-item">
          <div className="form-control">
            <textarea
              rows="3"
              value={text}
              className="input"
              placeholder="Message"
              onChange={e => onChangeText(e.target.value)}
            />
          </div>
        </div>
        <div className="btns">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Send
          </button>
          <button
            type="button"
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

MailModal.propTypes = {
  mailto: PropTypes.array.isRequired,
  text: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChangeMail: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired
};

export default MailModal;
