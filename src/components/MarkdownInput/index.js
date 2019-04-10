import React, { Component } from 'react';
import codemirror from 'codemirror';
import { debounce } from 'lodash';
import styles from './styles.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/theme/material.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';

const noop = () => {};

class MarkdownInput extends Component {
  static defaultProps = {
    onChange: noop,
    onScroll: noop,
  };

  textAreaRef = null;

  componentDidMount() {
    const { onChange, onScroll } = this.props;
    this.editor = codemirror.fromTextArea(this.textAreaRef, {
      mode: 'text/x-markdown',
      highlightFormatting: true,
      matchBrackets: true,
      matchTags: true,
    });
    this.editor.on('change', debounce(() => onChange(this.editor.getValue()), 500));
    this.editor.on('scroll', () => onScroll(this.editor.getScrollInfo()));
  }

  render() {
    return (
      <div className={styles.markdownInput}>
        <textarea
          className={styles.markdownTextArea}
          ref={ele => {
            this.textAreaRef = ele;
          }}
        />
      </div>
    );
  }
}

export default MarkdownInput;
