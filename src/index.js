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

// eslint-disable-next-line
import 'file-loader?name=[name].[ext]!./assets/favicon.ico';

const history = createHistory();
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
store.onRoute('/link/:linkId', ({ match, dispatch }) => {
  const { linkId } = match.params;
  dispatch({
    type: 'link/getLink',
    payload: linkId
  }).catch((e) => {
    message.error(e.message);
  });
});

store.dispatch(push(window.location.pathname));

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root'),
);
