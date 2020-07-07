import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from '../utils';
import Upload from '../components/Upload';
import LinkMaker from '../components/LinkMaker';
import MailModal from '../components/MailModal';

import './Home.less';

function Home({ user }) {
  const [list, setList] = useState(null);
  const [step, setStep] = useState('upload');
  const [modal, setModal] = useState({
    show: false,
    mails: [],
    msg: ''
  });
  const makeLink = (arr) => {
    setStep('link');
    setList(arr);
  };
  const sendMail = (arr) => {
    setList(arr);
    setModal(prev => ({ ...prev, show: true }));
  };
  const close = () => setModal(prev => ({
    ...prev, show: false
  }));
  const back = () => {
    setStep('upload');
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
  const child = () => {
    if (!user) {
      return (
        <div className="home-intro">
          <h3>Share Your Files</h3>
          <p>
            Free
            <span>&bull;</span>
            Fast
            <span>&bull;</span>
            Secure
            <span>&bull;</span>
            Simple
          </p>
          <a href="/login" className="btn btn-primary btn-lg">Start to share</a>
        </div>
      );
    }
    if (step === 'upload') {
      return (
        <Upload
          onMake={data => makeLink(data)}
          onSend={data => sendMail(data)}
        />
      );
    }
    if (step === 'link') {
      return (
        <LinkMaker
          list={list}
          onBack={back}
        />
      );
    }
    if (step === 'mail') {
      return (
        <LinkMaker
          list={list}
          mails={modal.mails}
          msg={modal.msg}
          onBack={back}
        />
      );
    }
    return null;
  };
  return (
    <div className="home-section">
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

Home.propTypes = {
  user: PropTypes.any
};
Home.defaultProps = {
  user: null
};

function mapState({ user }) {
  return {
    user: user.info
  };
}

export default connect(mapState)(Home);
