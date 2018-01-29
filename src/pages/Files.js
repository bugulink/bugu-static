import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LinkMaker from '../components/LinkMaker';
import MailModal from '../components/MailModal';
import { remain, humanSize, message } from '../utils';

import './Files.less';

class Files extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    step: 'init',
    showModal: false,
    mails: [],
    msg: ''
  };

  makeLink() {
    this.setState({ step: 'link' });
  }

  sendMail() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  back() {
    this.setState({
      step: 'init',
      mails: [],
      msg: ''
    });
  }

  handleSend() {
    const { mails } = this.state;
    if (mails.length === 0) {
      message.error('At least 1 people!');
      return;
    }
    if (mails.length > 20) {
      message.error('Up to 20 people!');
      return;
    }
    this.setState({
      step: 'mail',
      showModal: false
    });
  }

  render() {
    const {
      list, count, offset, dispatch
    } = this.props;
    const {
      step, mails, msg, showModal
    } = this.state;
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
              <button className="btn" disabled={arr.length === 0} onClick={() => this.makeLink()}>Make link</button>
              <button className="btn" disabled={arr.length === 0} onClick={() => this.sendMail()}>Send email</button>
              <Link to="/" className="btn btn-primary">
                <i className="icon icon-upload" />Upload
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
                      <td className="center">{humanSize(file.size, 1)}</td>
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
                <button className="btn btn-lg" onClick={loadMore}>Load more...</button>
              </div>
            ) : null}
          </div>
        );
      }
      if (step === 'link') {
        return (
          <LinkMaker
            list={arr}
            onBack={() => this.back()}
          />
        );
      }
      if (step === 'mail') {
        return (
          <LinkMaker
            list={arr}
            mails={mails}
            msg={msg}
            onBack={() => this.back()}
          />
        );
      }
      return null;
    };
    return (
      <div className="files-section">
        {child()}
        <MailModal
          show={showModal}
          mailto={mails}
          text={msg}
          onClose={() => this.close()}
          onSubmit={() => this.handleSend()}
          onChangeMail={data => this.setState({ mails: data })}
          onChangeText={text => this.setState({ msg: text })}
        />
      </div>
    );
  }
}

Files.propTypes = {
  list: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapState({ file }) {
  return file;
}

export default connect(mapState)(Files);
