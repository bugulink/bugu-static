import axios from 'axios';

export function isEmail(str) {
  return /.+@.+\..+/.test(str);
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
