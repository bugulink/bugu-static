import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import yax from 'yax';

import './index.less';
import user from './models/user';
import link from './models/link';
import file from './models/file';
import Routes from './routes';

// eslint-disable-next-line
import 'file-loader?name=[name].[ext]!./assets/favicon.ico';

const store = yax({
  state: {
    show: false
  },
  reducers: {
    show(state) {
      return { ...state, show: true };
    },
    hide(state) {
      return { ...state, show: false };
    },
  },
  modules: { user, link, file },
});

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
);
