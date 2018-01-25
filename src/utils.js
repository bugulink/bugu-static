import axios from 'axios';

export function isEmail(str) {
  return /^[^;]+@[^;]+\.[^;]+$/.test(str);
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
