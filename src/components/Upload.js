import React, { Component } from 'react';
import File from './File';
import './Upload.less';

function preventEvent(e) {
  e.preventDefault();
}

let index = 0;
function uuid() {
  index++;
  return index;
}

export default class Uploader extends Component {
  state = {
    files: []
  };

  handleClick() {
    this.input.click();
  }

  handleDrop(e) {
    e.preventDefault();
    this.addFiles(e.dataTransfer.files);
  }

  handleChange(e) {
    if (e.target.value) {
      this.addFiles(e.target.files);
      e.target.value = '';
    }
  }

  addFiles(items) {
    const { files } = this.state;
    for (let i = 0; i < items.length; i++) {
      items[i].id = uuid();
    }
    this.setState({ files: [...files, ...items] });
  }

  delete(id) {
    const { files } = this.state;
    this.setState({
      files: files.filter(f => f.id !== id)
    });
  }

  update(id, info) {
    const { files } = this.state;
    files.forEach(file => {
      if (file.id === id) {
        file.done = true;
        file.info = info;
      }
    });
    this.setState({ files });
  }

  render() {
    const { files } = this.state;
    const isAllDone = files.length && files.reduce((pre, cur) => {
      return pre && cur.done;
    }, true);
    return (
      <div className="upload-main">
        <div
          role="button"
          tabIndex="0"
          className="drop-block"
          onClick={() => this.handleClick()}
          onKeyPress={() => this.handleClick()}
          onDragOver={preventEvent}
          onDragEnter={preventEvent}
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
              onDelete={() => this.delete(file.id)}
              onFinish={(info) => this.update(file.id, info)}
            />
          ))}
        </div>
        <div className="link-btns">
          <button className="btn btn-primary btn-lg" disabled={!isAllDone}>Make link</button>
          <span>OR</span>
          <button className="btn btn-primary btn-lg" disabled={!isAllDone}>Send email</button>
        </div>
      </div>
    );
  }
}
