import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io, { CancelToken } from 'axios';
import { encode } from '../utils';
import fetch from '../request';

// Chunk size 4M (force)
const CHUNK_SIZE = 4 * 1024 * 1024;
const HOST = '//up.qiniu.com';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class Chunk {
  constructor(file, offset, opts) {
    this.file = file;
    this.offset = offset;
    this.from = offset * CHUNK_SIZE;
    this.to = Math.min(file.size, (offset + 1) * CHUNK_SIZE);
    this.total = 0;
    this.retry = 0;
    this.loaded = 0;
    this.finished = false;
    this.opts = opts;
  }

  chunkData() {
    const { file } = this;
    let fun = 'slice';
    if (file.slice) {
      fun = 'slice';
    } else if (file.mozSlice) {
      fun = 'mozSlice';
    } else if (file.webkitSlice) {
      fun = 'webkitSlice';
    }
    return file[fun](this.from, this.to, file.type);
  }

  progress() {
    if (this.finished) {
      return 1;
    }
    return this.total > 0 ? this.loaded / this.total : 0;
  }

  start(up) {
    if (up) {
      this.up = up;
    }

    const $ = this;
    function request(url, data, config) {
      return io.post(url, data, config)
        .then(res => Promise.resolve(res.data))
        .catch((e) => {
          if (io.isCancel(e)) {
            $.retry = 0;
            return Promise.resolve(null);
          }
          $.retry++;
          if ($.retry === 3) {
            return Promise.reject(e);
          }
          // Delay one second
          return delay(1000).then(() => request(url, data, config));
        });
    }

    this.cts = CancelToken.source();
    const url = `${HOST}/mkblk/${this.to - this.from}`;
    request(url, this.chunkData(), {
      headers: {
        Authorization: `UpToken ${this.up.token}`
      },
      cancelToken: this.cts.token,
      onUploadProgress: (e) => {
        if (e.lengthComputable) {
          this.loaded = e.loaded;
          this.total = e.total;
          this.opts.change();
        }
      }
    }).then((data) => {
      if (data) {
        this.data = data;
        this.finished = true;
        this.opts.change();
        this.opts.finish();
      }
    });
  }
  stop() {
    if (!this.finished) {
      this.cts.cancel();
      this.loaded = 0;
      this.total = 0;
      this.opts.change();
    }
  }
  resume() {
    if (!this.finished) {
      this.start();
    }
  }
}

export default class File extends Component {
  static propTypes = {
    file: PropTypes.any.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  state = {
    progress: 0,
    paused: false,
    finished: false
  };

  count = 0;
  chunks = [];

  componentWillMount() {
    const { file } = this.props;
    const len = Math.ceil(file.size / CHUNK_SIZE);
    for (let i = 0; i < len; i++) {
      const chunk = new Chunk(file, i, {
        change: () => this.change(),
        finish: () => this.finish()
      });
      this.chunks.push(chunk);
    }
    this.start();
  }

  change() {
    const { file } = this.props;
    let bytes = 0;
    this.chunks.forEach((c) => {
      bytes += c.progress() * (c.to - c.from);
    });
    const progress = bytes / file.size;
    this.setState({ progress });
  }

  start() {
    fetch.post('/uptoken').then(({ data }) => {
      this.up = data;
      this.chunks.forEach(c => c.start(data));
    });
  }

  resume(e) {
    e.preventDefault();
    this.chunks.forEach(c => c.resume());
    this.setState({ paused: false });
    this.change();
  }

  stop(e) {
    e.preventDefault();
    this.chunks.forEach(c => c.stop());
    this.setState({ paused: true });
    this.change();
  }

  finish() {
    this.count++;
    if (this.count === this.chunks.length) {
      const { file } = this.props;
      const path = `${this.up.prefix}${file.name}`;
      const url = `${HOST}/mkfile/${file.size}/key/${encode(path)}`;
      const data = this.chunks.map(c => c.data.ctx).join(',');
      io.post(url, data, {
        headers: {
          Authorization: `UpToken ${this.up.token}`
        }
      }).then((res) => {
        console.log(res.data);
        this.setState({ finished: true });
      });
    }
  }

  delete(e) {
    e.preventDefault();
    this.chunks.forEach(c => c.stop());
    this.props.onDelete(e);
  }

  render() {
    const { file } = this.props;
    const { progress, paused, finished } = this.state;
    const width = `${Math.floor(progress * 100)}%`;
    const actions = () => {
      if (finished) return null;
      if (paused) {
        return <a href="#" onClick={e => this.resume(e)}><i className="icon icon-play" /></a>;
      }
      return <a href="#" onClick={e => this.stop(e)}><i className="icon icon-stop" /></a>;
    };
    return (
      <div className="file-item" key={file.id}>
        <a href="#" className="file-link">
          <i className="icon icon-file" />
          <span>{file.name}</span>
        </a>
        <div className="file-action">
          {actions()}
          <a href="#" onClick={e => this.delete(e)}><i className="icon icon-close" /></a>
        </div>
        {finished ? null : (
          <div className="progress-bar">
            <div className="progress" style={{ width }} />
          </div>
        )}
      </div>
    );
  }
}
