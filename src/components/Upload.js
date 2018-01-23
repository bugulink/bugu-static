import React, { Component } from 'react';

import './Upload.less';

function preventEvent(e) {
  e.preventDefault();
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
    this.setState({ files: [...files, ...items] });
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
          {files.map((file) => {
            const width = '45%';
            const key = `${file.name}_${file.size}_${file.lastModified}`;
            return (
              <div className="file-item" key={key}>
                <a href="#" className="file-link">
                  <i className="icon icon-file" />
                  <span>{file.name}</span>
                </a>
                <div className="file-action">
                  <a href="#"><i className="icon icon-stop" /></a>
                  <a href="#"><i className="icon icon-close" /></a>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
