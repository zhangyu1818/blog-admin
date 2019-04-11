import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import codemirror from 'codemirror';
import { debounce } from 'lodash';
import styles from './styles.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/selection/mark-selection';

import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/ambiance-mobile.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/colorforth.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/duotone-dark.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/theme/erlang-dark.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/hopscotch.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/isotope.css';
import 'codemirror/theme/lesser-dark.css';
import 'codemirror/theme/liquibyte.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/neat.css';
import 'codemirror/theme/neo.css';
import 'codemirror/theme/night.css';
import 'codemirror/theme/nord.css';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/theme/panda-syntax.css';
import 'codemirror/theme/paraiso-dark.css';
import 'codemirror/theme/paraiso-light.css';
import 'codemirror/theme/pastel-on-dark.css';
import 'codemirror/theme/railscasts.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/theme/seti.css';
import 'codemirror/theme/shadowfox.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/ssms.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/tomorrow-night-bright.css';
import 'codemirror/theme/tomorrow-night-eighties.css';
import 'codemirror/theme/ttcn.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/theme/vibrant-ink.css';
import 'codemirror/theme/xq-dark.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/theme/yeti.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/theme/zenburn.css';

const MarkdownInput = forwardRef(({ onChange, onScroll, scrollPercent, className }, ref) => {
  const textAreaRef = useRef();
  const editor = useRef();
  const mouseIn = useRef(false);

  useEffect(() => {
    editor.current = codemirror.fromTextArea(textAreaRef.current, {
      mode: 'text/x-markdown',
      highlightFormatting: true,
      matchBrackets: true,
      matchTags: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      autofocus: true,
      extraKeys: { Enter: 'newlineAndIndentContinueMarkdownList' },
    });
    editor.current.on('change', debounce(() => onChange(editor.current.getValue()), 500));
    editor.current.on('scroll', () => {
      if (!mouseIn.current) return;
      const positionInfo = editor.current.getScrollInfo();
      const height = positionInfo.height - positionInfo.clientHeight;
      const percent = positionInfo.top / height;
      if (onScroll) onScroll(percent);
    });
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      action: action => {
        switch (action) {
          case 'undo':
            editor.current.undo();
            return;
          case 'redo':
            editor.current.redo();
            return;
          case 'highlight': {
            editor.current
              .listSelections()
              .map(({ anchor, head }) => [
                { line: anchor.line, ch: anchor.ch },
                { line: head.line, ch: head.ch },
              ])
              .forEach(selected => {
                const [start, end] = selected;
                const markedText = editor.current.markText(start, end, {
                  className: 'styled-background',
                });
              });
            return;
          }
          default: {
            const selections = editor.current.getSelections();
            const newStr = {
              bold: str => `**${str}**`,
              italic: str => `*${str}*`,
              strikethrough: str => `~~${str}~~`,
              underline: str => `++${str}++`,
            };
            const boldSelections = selections.map(str => (str !== '' ? newStr[action](str) : str));
            editor.current.replaceSelections(boldSelections, 'around');
          }
        }
      },
      theme: theme => editor.current.setOption('theme', theme),
    }),
    []
  );
  useEffect(
    () => {
      const positionInfo = editor.current.getScrollInfo();
      const height = positionInfo.height - positionInfo.clientHeight;
      editor.current.scrollTo(0, height * scrollPercent);
    },
    [scrollPercent]
  );

  return (
    <div className={className}>
      <div
        className={styles.markdownInput}
        onMouseEnter={() => {
          mouseIn.current = true;
        }}
        onMouseLeave={() => {
          mouseIn.current = false;
        }}
      >
        <textarea className={styles.markdownTextArea} ref={textAreaRef} />
      </div>
    </div>
  );
});

export default MarkdownInput;
