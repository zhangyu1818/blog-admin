import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
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

const getStr = {
  bold: str => `**${str}**`,
  italic: str => `*${str}*`,
  strikethrough: str => `~~${str}~~`,
  underline: str => `++${str}++`,
  heading1: str => `# ${str}`,
  heading2: str => `## ${str}`,
  heading3: str => `### ${str}`,
  heading4: str => `#### ${str}`,
  heading5: str => `##### ${str}`,
  heading6: str => `###### ${str}`,
  unorderedList: str => `- ${str}`,
  orderedList: str => `1. ${str}`,
  link: str => `[${str}]()`,
  image: str => `![${str}]()`,
  unCompleted: str => `- [ ] ${str}`,
  completed: str => `- [x] ${str}`,
  code: str => `\n\`\`\`\n${str}\n\`\`\``,
};
const getEmptyOffset = {
  bold: 2,
  italic: 1,
  strikethrough: 2,
  underline: 2,
  link: 1,
  image: 2,
};

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
        editor.current.focus();
        switch (action) {
          case 'undo':
            editor.current.undo();
            return;
          case 'redo':
            editor.current.redo();
            return;
          case 'horizontalRule': {
            editor.current.execCommand('goLineEnd');
            if (editor.current.getLine(editor.current.getCursor().line))
              editor.current.execCommand('newlineAndIndent');
            editor.current.execCommand('newlineAndIndent');
            const pos = editor.current.getCursor();
            editor.current.replaceRange('---', pos, pos);
            editor.current.execCommand('newlineAndIndent');
            return;
          }
          case 'table': {
            editor.current.execCommand('goLineEnd');
            if (editor.current.getLine(editor.current.getCursor().line))
              editor.current.execCommand('newlineAndIndent');
            editor.current.execCommand('newlineAndIndent');
            const pos = editor.current.getCursor();
            editor.current.replaceRange(
              `header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2`,
              pos,
              pos
            );
            editor.current.execCommand('newlineAndIndent');
            return;
          }
          case 'quote': {
            editor.current.execCommand('goLineStart');
            const pos = editor.current.getCursor();
            editor.current.replaceRange('> ', pos, pos);
            editor.current.execCommand('goLineEnd');
            return;
          }
          case 'highlight': {
            editor.current
              .listSelections()
              .map(({ anchor, head }) =>
                [{ line: anchor.line, ch: anchor.ch }, { line: head.line, ch: head.ch }].sort(
                  (a, b) => {
                    if (a.line !== b.line) return a.line - b.line;
                    return a.ch - b.ch;
                  }
                )
              )
              .forEach(selected => {
                const [start, end] = selected;
                let isExist = false;
                editor.current.findMarks(start, end).forEach(marked => {
                  const { from, to } = marked.find();
                  if (
                    !isExist &&
                    from.line === start.line &&
                    from.ch === start.ch &&
                    to.line === end.line &&
                    to.ch === end.ch
                  )
                    isExist = true;
                  marked.clear();
                });
                if (isExist) return;
                editor.current.markText(start, end, {
                  className: styles.markedText,
                  addToHistory: true,
                });
              });
            return;
          }
          default: {
            if (editor.current.somethingSelected()) {
              const selections = editor.current.getSelections();
              const newSelections = selections.map(str => (str !== '' ? getStr[action](str) : str));
              editor.current.replaceSelections(newSelections);
            } else {
              const pos = editor.current.getCursor();
              editor.current.replaceRange(getStr[action](''), pos, pos);
              const offset = getEmptyOffset[action];
              if (offset) editor.current.setCursor({ ...pos, ch: pos.ch + offset });
            }
            if (action === 'code') {
              editor.current.execCommand('goLineUp');
              editor.current.execCommand('goLineEnd');
            }
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
