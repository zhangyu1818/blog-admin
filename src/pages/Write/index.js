import React, { useRef, useCallback } from 'react';
import Prism from 'prismjs';
import Marked from 'marked';
import styles from './styles.less';
import MarkdownInput from '@/components/MarkdownInput';

import 'prismjs/themes/prism-tomorrow.css';

const WritePage = () => {
  const outputAreaRef = useRef();
  const onInputChange = useCallback(value => {
    outputAreaRef.current.innerHTML = Marked(value);
    outputAreaRef.current.querySelectorAll('pre code').forEach(block => {
      Prism.highlightElement(block);
    });
  }, []);
  const onInputScroll = useCallback(({ top, height, clientHeight }) => {
    const percent = top / (height - clientHeight);
    const innerHeight = outputAreaRef.current.clientHeight - clientHeight;
    outputAreaRef.current.parentNode.scrollTop = innerHeight * percent;
  }, []);
  return (
    <div className={styles.writeContainer}>
      <div className={styles.inputAreaWrapper}>
        <MarkdownInput onChange={onInputChange} onScroll={onInputScroll} />
      </div>
      <div className={styles.outputAreaWrapper}>
        <div ref={outputAreaRef} className="markdown-body" />
      </div>
    </div>
  );
};
export default WritePage;
