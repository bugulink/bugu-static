import axios from 'axios';

const request = {};

function handle(req) {
  return req.catch((err) => {
    const data = err.response && err.response.data;
    if (data && data.message) {
      return Promise.reject(data);
    }
    return Promise.reject({
      status: 500,
      message: 'System error'
    });
  });
}

['get', 'delete', 'head'].forEach((method) => {
  request[method] = (url, data = {}, config) => {
    const query = Object.keys(data)
      .map(k => `${k}=${data[k]}`)
      .join('&');
    const tmp = url.indexOf('?') >= 0
      ? `${url}&${query}`
      : `${url}?${query}`;
    const req = axios[method](tmp, config);
    return handle(req);
  };
});

['post', 'put', 'patch'].forEach((method) => {
  request[method] = (url, data, config) => {
    const req = axios[method](url, data, config);
    return handle(req);
  };
});

export default request;
