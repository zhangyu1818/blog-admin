import React, { useRef, useCallback } from 'react';
import { Input } from 'antd';
import Marked from 'marked';
import styles from './styles.less';

const { TextArea } = Input;

const WritePage = () => {
  const inputAreaRef = useRef();
  const outputAreaRef = useRef();
  const onInputAreaChange = useCallback(() => {
    const inputValue = inputAreaRef.current.textAreaRef.value;
    outputAreaRef.current.innerHTML = Marked(inputValue);
  }, []);
  return (
    <div className={styles.writeContainer}>
      <div className={styles.inputAreaWrapper}>
        <TextArea ref={inputAreaRef} className={styles.inputArea} onChange={onInputAreaChange} />
      </div>
      <div className={styles.outputAreaWrapper}>
        <div ref={outputAreaRef} className="markdown-body" />
      </div>
    </div>
  );
};
export default WritePage;
