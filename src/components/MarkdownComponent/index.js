import React, { useCallback, useEffect, useRef, useState } from 'react';
import MarkdownInput from '@/components/MarkdownInput';
import MarkdownOutput from '@/components/MarkdownOutput';
import classNames from 'classnames';
import Marked from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { Icon, Divider, Popover } from 'antd';
import styles from './styles.less';

const light = [
  'default',
  '3024-day',
  'ambiance-mobile',
  'base16-light',
  'duotone-light',
  'eclipse',
  'elegant',
  'idea',
  'mdn-like',
  'neat',
  'neo',
  'paraiso-light',
  'solarized',
  'ssms',
  'ttcn',
  'xq-light',
  'yeti',
];
const dark = [
  '3024-night',
  'abcdef',
  'ambiance',
  'base16-dark',
  'bespin',
  'blackboard',
  'cobalt',
  'colorforth',
  'darcula',
  'dracula',
  'duotone-dark',
  'erlang-dark',
  'gruvbox-dark',
  'hopscotch',
  'icecoder',
  'isotope',
  'lesser-dark',
  'liquibyte',
  'lucario',
  'material',
  'mbo',
  'midnight',
  'monokai',
  'night',
  'nord',
  'oceanic-next',
  'panda-syntax',
  'paraiso-dark',
  'pastel-on-dark',
  'railscasts',
  'rubyblue',
  'seti',
  'shadowfox',
  'the-matrix',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'twilight',
  'vibrant-ink',
  'xq-dark',
  'yonce',
  'zenburn',
];
const themeList = [
  {
    type: 'Bright',
    list: light,
  },
  {
    type: 'Dark',
    list: dark,
  },
];

const Markdown = props => {
  const [scroll, setScroll] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('markdown-theme') || 'default');
  const outputAreaRef = useRef();
  const inputAreaRef = useRef();
  const onInputChange = useCallback(value => {
    outputAreaRef.current.innerHTML = Marked(value);
    outputAreaRef.current.querySelectorAll('pre code').forEach(block => {
      Prism.highlightElement(block);
    });
  }, []);
  const onClickToolBar = action => () => {
    inputAreaRef.current.action(action);
  };
  const ThemeListRender = dataSource =>
    dataSource.map(item => (
      <dl className={styles.themeList} key={item.type}>
        <dt>{item.type}</dt>
        {item.list.map(listItem => (
          <dd
            key={listItem}
            className={theme === listItem ? styles.active : null}
            onClick={() => {
              localStorage.setItem('markdown-theme', listItem);
              setTheme(listItem);
            }}
          >
            {listItem}
          </dd>
        ))}
      </dl>
    ));
  useEffect(
    () => {
      inputAreaRef.current.theme(theme);
    },
    [theme]
  );
  const { containerClassName, inputClassName, outputClassName } = props;
  return (
    <div className={styles.markdown}>
      <div className={styles.title}>
        <input className={styles.titleName} defaultValue="学习笔记" />
      </div>
      <div className={styles.toolbar}>
        <Icon
          shape="circle"
          className={styles.actionIcon}
          type="undo"
          title="Undo"
          onClick={onClickToolBar('undo')}
        />
        <Icon
          className={styles.actionIcon}
          type="redo"
          title="Redo"
          onClick={onClickToolBar('redo')}
        />
        <Divider type="vertical" />
        <Icon
          className={styles.actionIcon}
          type="bold"
          title="Bold"
          onClick={onClickToolBar('bold')}
        />
        <Icon
          className={styles.actionIcon}
          type="italic"
          title="Italic"
          onClick={onClickToolBar('italic')}
        />
        <Icon
          className={styles.actionIcon}
          type="strikethrough"
          title="Strikethrough"
          onClick={onClickToolBar('strikethrough')}
        />
        <Icon
          className={styles.actionIcon}
          type="underline"
          title="Underline"
          onClick={onClickToolBar('underline')}
        />
        <Icon
          className={styles.actionIcon}
          type="highlight"
          title="Mark"
          onClick={onClickToolBar('highlight')}
        />
        <Divider type="vertical" />
        <i className={styles.actionIcon} title="Heading 1" onClick={onClickToolBar('heading-1')}>
          h1
        </i>
        <i className={styles.actionIcon} title="Heading 2" onClick={onClickToolBar('heading-2')}>
          h2
        </i>
        <i className={styles.actionIcon} title="Heading 3" onClick={onClickToolBar('heading-3')}>
          h3
        </i>
        <i className={styles.actionIcon} title="Heading 4" onClick={onClickToolBar('heading-4')}>
          h4
        </i>
        <i className={styles.actionIcon} title="Heading 5" onClick={onClickToolBar('heading-5')}>
          h5
        </i>
        <i className={styles.actionIcon} title="Heading 6" onClick={onClickToolBar('heading-6')}>
          h6
        </i>
        <Divider type="vertical" />
        <Icon
          className={styles.actionIcon}
          type="bars"
          title="Unordered List"
          onClick={onClickToolBar('unordered-ist')}
        />
        <Icon
          className={styles.actionIcon}
          type="ordered-list"
          title="Ordered List"
          onClick={onClickToolBar('ordered-ist')}
        />
        <Icon
          className={styles.actionIcon}
          type="link"
          title="Link"
          onClick={onClickToolBar('link')}
        />
        <Icon className={styles.actionIcon} type="picture" title="Image" />
        <Popover
          overlayClassName={styles.themeListWrapper}
          placement="bottom"
          trigger="click"
          content={ThemeListRender(themeList)}
        >
          <Icon className={styles.actionIcon} type="skin" title="Theme" />
        </Popover>
      </div>
      <div className={classNames(styles.writeContainer, containerClassName)}>
        <MarkdownInput
          ref={inputAreaRef}
          className={classNames(styles.inputAreaWrapper, inputClassName)}
          onChange={onInputChange}
          scrollPercent={scroll}
          onScroll={setScroll}
        />
        <MarkdownOutput
          className={classNames(styles.outputAreaWrapper, outputClassName)}
          ref={outputAreaRef}
          scrollPercent={scroll}
          onScroll={setScroll}
        />
      </div>
    </div>
  );
};
export default Markdown;
