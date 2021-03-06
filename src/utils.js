import axios from 'axios';

export function isEmail(str) {
  return /^[^;]+@[^;]+\.[^;]+$/.test(str);
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return `${time}${label}s`;
}

export function remain(ttl) {
  if (ttl <= 0) {
    return 'Expired';
  }
  const { round } = Math;
  if (ttl < 3600) {
    return pluralize(round(ttl / 60), ' minute');
  }
  if (ttl < 86400) {
    return pluralize(round(ttl / 3600), ' hour');
  }

  return pluralize(round(ttl / 86400), ' day');
}

const mags = ' KMGTPEZY';
export function humanSize(bytes, precision = 1) {
  const magnitude = Math.min(Math.log(bytes) / Math.log(1024) | 0, mags.length - 1);
  const result = bytes / (1024 ** magnitude);
  const suffix = `${mags[magnitude].trim()}B`;
  return result.toFixed(precision) + suffix;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function makeRequest(maxRetry, method = 'post') {
  let retry = 0;
  return function request(url, data, config) {
    return axios[method](url, data, config)
      .then(res => Promise.resolve(res.data))
      .catch((e) => {
        if (axios.isCancel(e)) {
          return Promise.resolve(null);
        }
        retry++;
        if (retry === maxRetry) {
          return Promise.reject(e);
        }
        // Delay one second
        return delay(1000).then(() => request(url, data, config));
      });
  };
}

let timer = null;
export function toast(msg, type, icon) {
  const id = 'toast-root';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.setAttribute('id', id);
    document.body.appendChild(el);
  }
  if (timer) {
    el.className = '';
    window.clearInterval(timer);
  }
  setTimeout(() => {
    el.innerHTML = `
      <div class="toast-main ${type}">
        <i class="icon ${icon}"></i>
        <span>${msg}</span>
      </div>
    `;
    el.className = 'show';
    timer = window.setTimeout(() => {
      el.className = '';
    }, 5000);
  }, 0);
}

export const message = {
  success(msg) {
    toast(msg, 'success', 'icon-check-r');
  },
  error(msg) {
    toast(msg, 'error', 'icon-close-r');
  }
};

export function copy(e) {
  const elem = e.target;
  // From: https://github.com/zenorocha/select
  const isReadOnly = elem.hasAttribute('readonly');
  if (!isReadOnly) {
    elem.setAttribute('readonly', '');
  }

  elem.select();
  elem.setSelectionRange(0, elem.value.length);

  if (!isReadOnly) {
    elem.removeAttribute('readonly');
  }
  try {
    const isOk = document.execCommand('copy');
    if (isOk) {
      message.success('Copy success!');
    } else {
      message.error('Copy failed!');
    }
  } catch (err) {
    message.error('Copy failed!');
  }
}

export function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function readDir(dirReader, oldEntries, callback) {
  dirReader.readEntries((entries) => {
    const newEntries = [...oldEntries, ...entries];
    if (entries.length) {
      setTimeout(() => {
        readDir(dirReader, newEntries, callback);
      }, 0);
    } else {
      callback(newEntries);
    }
  }, () => {
    callback(oldEntries);
  });
}

function getRelativePath(file) {
  if (!file.fullPath || file.fullPath === `/${file.name}`) {
    return null;
  }
  return file.fullPath;
}

function fromEntry(dt) {
  const files = [];
  const allPromises = [];
  const traverseFile = entry => new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file) => {
        file.relativePath = getRelativePath(entry);
        files.push(file);
        resolve();
      }, () => {
        resolve();
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      readDir(dirReader, [], (entries) => {
        const promises = entries.map(e => traverseFile(e));
        Promise.all(promises).then(() => resolve());
      });
    }
  });

  toArray(dt.items).forEach((item) => {
    const entry = item.webkitGetAsEntry();
    if (entry) {
      allPromises.push(traverseFile(entry));
    }
  });
  return Promise.all(allPromises).then(() => files);
}

export function getDropFiles(dt) {
  if (dt.items && dt.items[0] && 'webkitGetAsEntry' in dt.items[0]) {
    return fromEntry(dt);
  }
  const files = toArray(dt.files);
  return Promise.resolve(files);
}
