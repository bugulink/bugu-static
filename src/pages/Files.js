import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { remain, humanSize, message } from '../utils';

import './Files.less';

function Files({
  list, count, offset, dispatch
}) {
  const select = (e, id) => {
    e.preventDefault();
    dispatch({ type: 'file/select', payload: id });
  };
  const loadMore = () => {
    dispatch({ type: 'file/getList' }).catch(() => {
      message.error('Load files failed! Please try again.');
    });
  };
  const selected = list.reduce((p, c) => p + (c.selected ? 1 : 0), 0);
  return (
    <div className="files-section">
      <div className="layout-container">
        <div className="files-btns">
          <button className="btn" disabled={selected <= 0}>Make link</button>
          <button className="btn" disabled={selected <= 0}>Send email</button>
          <Link to="/" className="btn btn-primary">
            <i className="icon icon-upload" />Upload
          </Link>
        </div>
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
              <th />
              <th>Name</th>
              <th className="center">Size</th>
              <th className="center">Remain</th>
              <th className="center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {list.map((file) => {
              const date = new Date(file.createdAt);
              const time = file.remain;
              return (
                <tr key={file.id} className={time <= 0 ? 'disabled' : ''}>
                  <td className="center">
                    <a href="#" className="checkbox" disabled={time <= 0} onClick={e => select(e, file.id)}>
                      {file.selected
                        ? <i className="icon icon-checked" />
                        : <i className="icon icon-unchecked" />}
                    </a>
                  </td>
                  <td>
                    <div className="ellipsis">
                      {file.url
                        ? <a href={file.url} title={file.name} download>{file.name}</a>
                        : <span title={file.name}>{file.name}</span>}
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

Files.propTypes = {
  list: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapState({ file }) {
  return file;
}

export default connect(mapState)(Files);
