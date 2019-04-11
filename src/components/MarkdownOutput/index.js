import React, { useEffect, useRef, forwardRef, useCallback } from 'react';

const MarkdownOutput = forwardRef(({ scrollPercent, onScroll, className }, ref) => {
  const mouseIn = useRef(false);
  const markdownBodyRef = ref;
  const onMarkdownBodyScroll = useCallback(() => {
    if (!mouseIn.current) return;
    const computedStyle = getComputedStyle(markdownBodyRef.current.parentNode);
    const padding =
      parseInt(computedStyle.paddingTop, 10) + parseInt(computedStyle.paddingBottom, 10);
    const innerHeight =
      markdownBodyRef.current.clientHeight -
      markdownBodyRef.current.parentNode.clientHeight +
      padding;
    const percent = markdownBodyRef.current.parentNode.scrollTop / innerHeight;
    if (onScroll) onScroll(percent);
  }, []);
  useEffect(
    () => {
      const computedStyle = getComputedStyle(markdownBodyRef.current.parentNode);
      const padding =
        parseInt(computedStyle.paddingTop, 10) + parseInt(computedStyle.paddingBottom, 10);
      const innerHeight =
        markdownBodyRef.current.clientHeight -
        markdownBodyRef.current.parentNode.clientHeight +
        padding;
      markdownBodyRef.current.parentNode.scrollTop = innerHeight * scrollPercent;
    },
    [scrollPercent]
  );
  return (
    <div
      className={className}
      onScroll={onMarkdownBodyScroll}
      onMouseEnter={() => {
        mouseIn.current = true;
      }}
      onMouseLeave={() => {
        mouseIn.current = false;
      }}
    >
      <div ref={ref} className="markdown-body" />
    </div>
  );
});
export default MarkdownOutput;
