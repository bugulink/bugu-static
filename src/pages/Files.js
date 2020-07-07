import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LinkMaker from '../components/LinkMaker';
import MailModal from '../components/MailModal';
import { remain, humanSize, message } from '../utils';

import './Files.less';

function Files({
  list, count, offset, dispatch
}) {
  const [step, setStep] = useState('init');
  const [modal, setModal] = useState({
    show: false,
    mails: [],
    msg: ''
  });

  useEffect(() => {
    dispatch({
      type: 'file/getList',
      payload: true
    }).catch(() => {
      message.error('Load files failed! Please try again.');
    });
  }, []);

  const makeLink = () => setStep('link');
  const sendMail = () => setModal(prev => ({
    ...prev,
    show: true
  }));
  const close = () => setModal(prev => ({
    ...prev,
    show: false
  }));
  const back = () => {
    setStep('init');
    setModal(prev => ({
      ...prev,
      mails: [],
      msg: ''
    }));
  };
  const handleSend = () => {
    const { mails } = modal;
    if (mails.length === 0) {
      message.error('At least 1 people!');
      return;
    }
    if (mails.length > 20) {
      message.error('Up to 20 people!');
      return;
    }
    setStep('mail');
    setModal(prev => ({ ...prev, show: false }));
  };
  const select = (e, id) => {
    e.preventDefault();
    dispatch({ type: 'file/select', payload: id });
  };
  const loadMore = () => {
    dispatch({ type: 'file/getList' }).catch(() => {
      message.error('Load files failed! Please try again.');
    });
  };
  const child = () => {
    const arr = list.filter(f => f.selected);
    if (step === 'init') {
      return (
        <div className="layout-container">
          <div className="files-btns">
            <button type="button" className="btn" disabled={arr.length === 0} onClick={makeLink}>Make link</button>
            <button type="button" className="btn" disabled={arr.length === 0} onClick={sendMail}>Send email</button>
            <Link to="/" className="btn btn-primary">
              <i className="icon icon-upload" />
              Upload
            </Link>
          </div>
          <table className="table table-hover">
            <colgroup>
              <col width="5%" />
              <col width="50%" />
              <col width="12%" />
              <col width="12%" />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th className="center">Size</th>
                <th className="center">Remain</th>
                <th className="center">Created At</th>
              </tr>
            </thead>
            <tbody>
              {list.map((file) => {
                const date = new Date(file.createdAt);
                const time = file.remain;
                return (
                  <tr key={file.id} className={time <= 0 ? 'disabled' : ''}>
                    <td className="center">
                      <a href="#" className="checkbox" disabled={time <= 0} onClick={e => select(e, file.id)}>
                        {file.selected
                          ? <i className="icon icon-checked" />
                          : <i className="icon icon-unchecked" />}
                      </a>
                    </td>
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
              {list.length === 0 ? (
                <tr className="no-hover">
                  <td className="center no-data" colSpan="5">
                    <i className="icon icon-nodata" />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          {offset < count ? (
            <div className="load-more">
              <button type="button" className="btn btn-lg" onClick={loadMore}>Load more...</button>
            </div>
          ) : null}
        </div>
      );
    }
    if (step === 'link') {
      return (
        <LinkMaker
          list={arr}
          onBack={back}
        />
      );
    }
    if (step === 'mail') {
      return (
        <LinkMaker
          list={arr}
          mails={modal.mails}
          msg={modal.msg}
          onBack={back}
        />
      );
    }
    return null;
  };
  return (
    <div className="files-section">
      {child()}
      <MailModal
        show={modal.show}
        mailto={modal.mails}
        text={modal.msg}
        onClose={close}
        onSubmit={handleSend}
        onChangeMail={data => setModal(prev => ({ ...prev, mails: data }))}
        onChangeText={text => setModal(prev => ({ ...prev, msg: text }))}
      />
    </div>
  );
}

Files.propTypes = {
  dispatch: PropTypes.func.isRequired,
  list: PropTypes.array,
  count: PropTypes.number,
  offset: PropTypes.number
};
Files.defaultProps = {
  list: [],
  count: 0,
  offset: 0
};

function mapState({ file }) {
  return file;
}

export default connect(mapState)(Files);
