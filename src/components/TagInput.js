import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmail, message } from '../utils';

import './TagInput.less';

export default class TagInput extends Component {
  static propTypes = {
    value: PropTypes.array,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: []
  };

  state = {
    text: ''
  };

  press(e) {
    if (e.key === ';' || e.key === ' ' || e.key === 'Enter') {
      this.add();
      e.preventDefault();
      return false;
    }
    return true;
  }

  add(clear) {
    const { onChange, value } = this.props;
    const { text } = this.state;
    if (isEmail(text)) {
      const tmp = value.filter(v => v !== text);
      tmp.push(text);
      this.setState({ text: '' });
      onChange(tmp);
    } else if (clear) {
      this.setState({ text: '' });
    } else {
      message.error('Email is invalid!');
    }
  }

  remove(str) {
    const { onChange, value } = this.props;
    const tmp = value.filter(v => v !== str);
    onChange(tmp);
  }

  focus() {
    if (this.el) {
      this.el.focus();
    }
  }

  render() {
    const { value } = this.props;
    const { text } = this.state;
    const holder = value.length ? '' : this.props.placeholder;
    const len = text.length + 1;
    const size = holder ? Math.max(len, 20) : len;
    return (
      <div
        role="button"
        tabIndex="0"
        className="tag-input"
        onClick={() => this.focus()}
        onKeyPress={() => this.focus()}
      >
        {value.map(item => (
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
          value={text}
          size={size}
          onChange={e => this.setState({ text: e.target.value })}
          onKeyPress={e => this.press(e)}
          onBlur={() => this.add(true)}
        />
      </div>
    );
  }
}
