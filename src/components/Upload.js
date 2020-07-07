import React, { Component } from 'react';
import PropTypes from 'prop-types';
import File from './File';
import { message, getDropFiles, toArray } from '../utils';
import fetch from '../request';

import './Upload.less';

let index = 0;
function uuid() {
  index++;
  return index;
}

export default class Uploader extends Component {
  static propTypes = {
    onMake: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired
  };

  state = {
    files: []
  };

  handleClick() {
    this.input.click();
  }

  handleDrop(e) {
    e.preventDefault();
    if (e.type === 'dragover') return;
    getDropFiles(e.dataTransfer)
      .then(files => this.addFiles(files));
  }

  handleChange(e) {
    if (e.target.value) {
      this.addFiles(toArray(e.target.files));
      e.target.value = '';
    }
  }

  addFiles(items) {
    const { files } = this.state;
    for (let i = 0; i < items.length; i++) {
      items[i].id = uuid();
      files.push(items[i]);
    }
    this.setState({ files });
  }

  delete(file) {
    const { id, done, info } = file;
    const remove = () => {
      const { files } = this.state;
      this.setState({
        files: files.filter(f => f.id !== id)
      });
    };
    if (done) {
      fetch.post('/file/remove', { id: info.id })
        .then(remove)
        .catch(() => message.error('Remove file failed! Please try again.'));
    } else {
      remove();
    }
  }

  update(id, info) {
    const { files } = this.state;
    files.forEach((file) => {
      if (file.id === id) {
        file.done = true;
        file.info = info;
      }
    });
    this.setState({ files });
  }

  render() {
    const { onMake, onSend } = this.props;
    const { files } = this.state;
    const isAllDone = files.length && files.reduce((pre, cur) => pre && cur.done, true);
    const list = files.map(f => f.info);
    return (
      <div className="upload-main">
        <div
          role="button"
          tabIndex="0"
          className="drop-block"
          onClick={() => this.handleClick()}
          onKeyPress={() => this.handleClick()}
          onDragOver={e => this.handleDrop(e)}
          onDrop={e => this.handleDrop(e)}
        >
          <i className="icon icon-upload" />
          <h4>Drop your files here!</h4>
          <p>You can drop multiple files, max 2G each.</p>
          <input
            multiple
            type="file"
            className="hidden-input"
            ref={(el) => { this.input = el; }}
            onChange={e => this.handleChange(e)}
          />
        </div>
        <div className="file-list">
          {files.map(file => (
            <File
              key={file.id}
              file={file}
              onDelete={() => this.delete(file)}
              onFinish={info => this.update(file.id, info)}
            />
          ))}
        </div>
        <div className="link-btns">
          <button
            type="button"
            disabled={!isAllDone}
            className="btn btn-primary btn-lg"
            onClick={() => onMake(list)}
          >
            Make link
          </button>
          <span>OR</span>
          <button
            type="button"
            disabled={!isAllDone}
            className="btn btn-primary btn-lg"
            onClick={() => onSend(list)}
          >
            Send email
          </button>
        </div>
      </div>
    );
  }
}
