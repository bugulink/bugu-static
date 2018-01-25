import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmail, message } from '../utils';

import './TagInput.less';

export default class TagInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = {
    value: '',
    list: []
  };

  componentWillReceiveProps(next) {
    if (next.data) {
      this.setState({ list: next.data });
    }
  }

  press(e) {
    if (e.key === ';' || e.key === ' ' || e.key === 'Enter') {
      this.add();
      e.preventDefault();
      return false;
    }
    return true;
  }

  add(clear) {
    const { onChange } = this.props;
    const { list, value } = this.state;
    if (isEmail(value)) {
      const tmp = list.filter(v => v !== value);
      tmp.push(value);
      this.setState({ list: tmp, value: '' });
      onChange(tmp);
    } else if (clear) {
      this.setState({ value: '' });
    } else {
      message.error('Email is invalid!');
    }
  }

  remove(str) {
    const { onChange } = this.props;
    const { list } = this.state;
    const tmp = list.filter(v => v !== str);
    this.setState({ list: tmp });
    onChange(tmp);
  }

  focus() {
    if (this.el) {
      this.el.focus();
    }
  }

  render() {
    const { list, value } = this.state;
    const holder = list.length ? '' : this.props.placeholder;
    const len = value.length + 1;
    const size = holder ? Math.max(len, 20) : len;
    return (
      <div
        role="button"
        tabIndex="0"
        className="tag-input"
        onClick={() => this.focus()}
        onKeyPress={() => this.focus()}
      >
        {list.map(item => (
          <div className="tag" key={item}>
            {item}
            <button className="tag-close" onClick={() => this.remove(item)}>
              <i className="icon icon-close" />
            </button>
          </div>
        ))}
        <input
          ref={(el) => { this.el = el; }}
          type="text"
          autocomplate="off"
          placeholder={holder}
          value={value}
          size={size}
          onChange={e => this.setState({ value: e.target.value })}
          onKeyPress={e => this.press(e)}
          onBlur={() => this.add(true)}
        />
      </div>
    );
  }
}
