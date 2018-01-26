import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { remain, humanSize, message } from '../utils';

import './Files.less';

function Files({ list, count, offset, dispatch }) {
  const selected = list.reduce((p, c) => (p && c.selected), true);
  const selectAll = (e) => {
    e.preventDefault();
    dispatch({ type: 'file/selectAll', payload: !selected });
  };
  const select = (e, id) => {
    e.preventDefault();
    dispatch({ type: 'file/select', payload: id });
  };
  const loadMore = () => {
    dispatch({ type: 'file/getList' }).catch(() => {
      message.error('Load files failed! Please try again.');
    });
  };
  return (
    <div className="files-section">
      <div className="layout-container">
        <table className="table table-hover">
          <colgroup>
            <col width="5%" />
            <col width="50%" />
            <col width="12%" />
            <col width="12%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th className="center">
                <a href="#" className="checkbox" onClick={selectAll}>
                  {selected
                    ? <i className="icon icon-checked" />
                    : <i className="icon icon-unchecked" />}
                </a>
              </th>
              <th>Name</th>
              <th className="center">Size</th>
              <th className="center">Remain</th>
              <th className="center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {list.map(file => {
              const date = new Date(file.createdAt);
              const exp = date.getTime() / 1000 + file.ttl;
              const now = Date.now() / 1000;
              const time = Math.round(exp - now);
              return (
                <tr key={file.id} className={time <= 0 ? 'disabled' : ''}>
                  <td className="center">
                    <a href="#" className="checkbox" onClick={(e) => select(e, file.id)}>
                      {file.selected
                        ? <i className="icon icon-checked" />
                        : <i className="icon icon-unchecked" />}
                    </a>
                  </td>
                  <td>
                    <div className="ellipsis">
                      <a href={file.url} title={file.name} download>{file.name}</a>
                    </div>
                  </td>
                  <td className="center">{humanSize(file.size, 1)}</td>
                  <td className="center">{remain(time)}</td>
                  <td className="center">{date.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {offset < count ? (
          <div className="load-more">
            <button className="btn btn-lg" onClick={loadMore}>Load more...</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function mapState({ file }) {
  return file;
}

export default connect(mapState)(Files);
