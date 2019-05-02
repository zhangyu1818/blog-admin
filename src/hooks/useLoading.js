import { useState } from 'react';

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const fn = async (...args) => {
    setLoading(true);
    const [promiseFetch, ...params] = args;
    try {
      return await promiseFetch(params);
    } finally {
      setLoading(false);
    }
  };
  return [loading, fn];
};

export default useLoading;
