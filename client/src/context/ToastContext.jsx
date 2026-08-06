import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

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

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) throw new Error("useToast must be used within a ToastProvider");

  return context;
};

export { ToastProvider, useToast };
