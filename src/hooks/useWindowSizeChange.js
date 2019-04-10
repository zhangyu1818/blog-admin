import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const useWindowSizeChange = (onChange, time = 500, triggerInit = false) => {
  const onSizeChange = useCallback(
    debounce(() => {
      if (onChange) onChange();
    }, time),
    []
  );
  useEffect(() => {
    if (triggerInit && onChange) onChange();
    window.addEventListener('resize', onSizeChange);
    return () => window.removeEventListener('resize', onSizeChange);
  }, []);
};
export default useWindowSizeChange;
