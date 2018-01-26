import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import yax from 'yax';
import router, { push } from 'yax-router';

import './index.less';
import { message } from './utils';
import user from './models/user';
import link from './models/link';
import file from './models/file';
import Routes from './routes';
// import * as handlers from './handlers';

const history = createHistory();
const store = yax({
  state: {
    loading: false,
  },
  reducers: {
    show(state) {
      return { ...state, loading: true };
    },
    hide(state) {
      return { ...state, loading: false };
    },
  },
  modules: { user, link, file },
}, router(history));

store.onRoute('/files', ({ dispatch }) => {
  dispatch({
    type: 'file/getList',
    payload: true
  }).catch(() => {
    message.error('Load files failed! Please try again.');
  });
});
store.onRoute('/links', ({ dispatch }) => {
  dispatch({
    type: 'link/getList',
    payload: true
  }).catch(() => {
    message.error('Load files failed! Please try again.');
  });
});

store.dispatch(push(window.location.pathname));

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root'),
);
