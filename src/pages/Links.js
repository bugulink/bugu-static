import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { remain, humanSize, message } from '../utils';

import './Links.less';

function Links({
  list, count, offset, dispatch
}) {
  const loadMore = () => {
    dispatch({ type: 'link/getList' }).catch(() => {
      message.error('Load links failed! Please try again.');
    });
  };
  return (
    <div className="links-section">
      <div className="layout-container">
        <table className="table table-hover">
          <colgroup>
            <col width="56%" />
            <col width="12%" />
            <col width="12%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th className="center">Link</th>
              <th className="center">Size</th>
              <th className="center">Remain</th>
              <th className="center">Created At</th>
            </tr>
          </thead>
          <tbody>
            {list.map((link) => {
              const { files } = link;
              const date = new Date(link.createdAt);
              const exp = date.getTime() + link.ttl * 1000;
              const time = Math.floor((exp - Date.now()) / 1000);
              const size = files.reduce((p, c) => (p + c.size), 0);
              return (
                <tr key={link.id} className={time <= 0 ? 'disabled' : ''}>
                  <td>
                    <div className="ellipsis">
                      <span>{files.length} files</span>
                      <Link to={`/link/${link.id}`}>{files[0].name}</Link>
                    </div>
                  </td>
                  <td className="center">{humanSize(size, 1)}</td>
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

Links.propTypes = {
  list: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapState({ link }) {
  return link;
}

export default connect(mapState)(Links);
