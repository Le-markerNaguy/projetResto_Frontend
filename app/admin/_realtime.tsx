import { useEffect } from "react";
import { io as socketIOClient } from "socket.io-client";

export function useOrderRealtime(fetchOrders: () => void) {
  useEffect(() => {
    const socket = socketIOClient(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000",
      { transports: ["websocket"] }
    );
    socket.on("new-order", (order) => {
      // Notification visuelle (remplacez par un toast si vous avez un composant de toast)
      alert("Nouvelle commande reçue !");
      fetchOrders(); // Recharge la liste des commandes
    });
    return () => {
      socket.disconnect();
    };
  }, [fetchOrders]);
}
