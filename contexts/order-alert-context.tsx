import React, { createContext, useContext, useState, ReactNode } from "react";

interface OrderAlertContextType {
  hasNewOrder: boolean;
  setHasNewOrder: (v: boolean) => void;
}

const OrderAlertContext = createContext<OrderAlertContextType | undefined>(undefined);

export function OrderAlertProvider({ children }: { children: ReactNode }) {
  const [hasNewOrder, setHasNewOrder] = useState(false);
  return (
    <OrderAlertContext.Provider value={{ hasNewOrder, setHasNewOrder }}>
      {children}
    </OrderAlertContext.Provider>
  );
}

export function useOrderAlert() {
  const ctx = useContext(OrderAlertContext);
  if (!ctx) throw new Error("useOrderAlert must be used within OrderAlertProvider");
  return ctx;
}
