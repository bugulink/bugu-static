import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { remain, humanSize } from '../utils';

import './Files.less';

function Files({ list, count, dispatch }) {
  return (
    <div className="files-section">
      <div className="layout-container">
        <table className="table">
          <colgroup>
            <col width="5%" />
            <col width="50%" />
            <col width="12%" />
            <col width="12%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th className="center"></th>
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
                <tr key={file.id}>
                  <td className="center">
                    <a href="#">
                      {file.selected
                        ? <i className="icon icon-checked" />
                        : <i className="icon icon-unchecked" />}
                    </a>
                  </td>
                  <td>{file.name}</td>
                  <td className="center">{humanSize(file.size, 1)}</td>
                  <td className="center">{remain(time)}</td>
                  <td className="center">{date.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function mapState({ file }) {
  return {
    list: file.list,
    count: file.count
  };
}

export default connect(mapState)(Files);
