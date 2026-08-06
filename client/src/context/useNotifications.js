import { useContext } from "react";

import NotificationContext from "./notificationContext.js";

const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) throw new Error("useNotifications must be used within a NotificationsProvider");

  return context;
};

export default useNotifications;
