import { useEffect, useState } from 'react';

/**
 * ResizeObserver를 사용하여 요소의 크기를 추적하는 커스텀 훅
 *
 * @param {React.RefObject} ref - 추적할 요소의 ref
 * @returns {Object} { height, width } - 요소의 높이와 너비
 *
 * @example
 * const ref = useRef(null);
 * const { height, width } = useResizeObserver(ref);
 *
 * return (
 *   <div ref={ref}>
 *     높이: {height}px, 너비: {width}px
 *   </div>
 * );
 */
export const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0
  });

  useEffect(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          height: entry.contentRect.height,
          width: entry.contentRect.width
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;
