import { useMemo, useState } from "react";

import ToastContext from "./toastContext.js";

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </ToastContext.Provider>
  );
};

export { ToastProvider };
