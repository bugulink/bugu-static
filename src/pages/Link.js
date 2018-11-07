import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'yax-router';
import Modal from '../components/Modal';
import {
  remain, humanSize, message, copy
} from '../utils';

import './Link.less';

function Link({ item, show, dispatch }) {
  if (!item) {
    return null;
  }
  const { files } = item;
  const path = `${window.location.protocol}//${window.location.host}/download/`;
  const changeCode = () => {
    dispatch({
      type: 'link/changeCode',
      payload: item.id
    }).then((code) => {
      const msg = code ? 'Add' : 'Remove';
      message.success(`${msg} link code success.`);
    }).catch((e) => {
      message.error(e.message);
    });
  };
  const showModal = () => {
    dispatch({ type: 'show' });
  };
  const hideModal = () => {
    dispatch({ type: 'hide' });
  };
  const deleteLink = () => {
    hideModal();
    dispatch({
      type: 'link/remove',
      payload: item.id
    }).then(() => {
      dispatch(push('/links'));
    }).catch(e => message.error(e.message));
  };
  return (
    <div className="link-section">
      <div className="layout-container">
        <div className="form">
          <div className="form-item">
            <div className="form-control">
              <span className="input-prefix">
                <i className="icon icon-link" />
              </span>
              <input
                readOnly
                type="text"
                className="input"
                value={`${path}${item.id}`}
                style={{ width: '350px' }}
                onClick={copy}
              />
            </div>
            {item.code ? (
              <div className="form-control">
                <input
                  readOnly
                  type="text"
                  className="input code-input"
                  value={item.code}
                  onClick={copy}
                />
                <span className="input-suffix">
                  <button type="button" className="btn btn-lg" onClick={changeCode}>
                    <i className="icon icon-unlock" />
                  </button>
                </span>
              </div>
            ) : (
              <div className="form-control">
                <button type="button" className="btn btn-lg" onClick={changeCode}>
                  <i className="icon icon-lock" />
                </button>
              </div>
            )}
            <button type="button" className="btn btn-lg remove-btn" onClick={showModal}>
              <i className="icon icon-trash" />
            </button>
          </div>
          {item.receiver ? (
            <div className="form-item email-info">
              <div className="title">
                <strong>To:</strong>
                {item.receiver}
              </div>
              <div className="content">{item.message || 'No message'}</div>
            </div>
          ) : null}
        </div>
        <table className="table table-hover">
          <colgroup>
            <col width="50%" />
            <col width="12%" />
            <col width="12%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th className="center">Size</th>
              <th className="center">Remain</th>
              <th className="center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const date = new Date(file.createdAt);
              const time = file.remain;
              return (
                <tr key={file.id} className={time <= 0 ? 'disabled' : ''}>
                  <td>
                    <div className="ellipsis">
                      {file.url
                        ? <a href={file.url} title={file.name} download>{file.name}</a>
                        : <span title={file.name}>{file.name}</span>}
                    </div>
                  </td>
                  <td className="center">{humanSize(file.size)}</td>
                  <td className="center">{remain(time)}</td>
                  <td className="center">{date.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        show={show}
        title="Are you absolutely sure?"
        onClose={hideModal}
      >
        <div>This action cannot be undone. This will permanently delete the link.</div>
        <div className="btns">
          <button
            type="button"
            className="btn btn-primary"
            onClick={deleteLink}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn"
            onClick={hideModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

Link.propTypes = {
  show: PropTypes.bool,
  item: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

Link.defaultProps = {
  show: false,
  item: null
};

function mapState({ link, show }) {
  return {
    show,
    item: link.item
  };
}

export default connect(mapState)(Link);
