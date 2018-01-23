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
    this.addFiles(e.target.files);
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

  render() {
    const { files } = this.state;
    return (
      <div>
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
            />
          ))}
        </div>
      </div>
    );
  }
}
