import { useState, useEffect, useCallback } from 'react';

const useAlert = (initialState = false, timeout = 3000) => {
  const [alertOpen, setAlertOpen] = useState(initialState);

  const showAlert = useCallback(() => {
    setAlertOpen(true);
  }, []);

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [alertOpen, timeout]);

  return { alertOpen, showAlert };
};

export default useAlert;
