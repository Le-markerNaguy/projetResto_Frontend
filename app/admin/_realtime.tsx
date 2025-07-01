import { useEffect } from "react";
import { io as socketIOClient } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { useOrderAlert } from "@/contexts/order-alert-context";

// Nouvelle version : accepte un callback pour badge
export function useOrderRealtime(
  onNewOrder?: () => void,
  opts?: { onNewOrder?: (order: any) => void }
) {
  const { toast } = useToast();
  const { setHasNewOrder } = useOrderAlert();

  useEffect(() => {
    const socket = socketIOClient(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000",
      { transports: ["websocket"] }
    );
    socket.on("new-order", (order) => {
      // Notification sonore
      const audio = new Audio("audio/MÉLODIE K - XYLOPHONE COURT (HOROFRANCE)  SONNERIE ÉCOLECOLLÈGELYCÉEEREACFA.mp3");
      audio.play();
      toast({
        title: "Nouvelle commande !",
        description: `Commande #${order.id} reçue pour la table ${order.table?.numero ?? "?"}`,
        duration: 6000,
      });
      setHasNewOrder(true); // Active le badge/icône
      if (onNewOrder) onNewOrder();
      if (opts?.onNewOrder) opts.onNewOrder(order);
    });
    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, opts, toast, setHasNewOrder]);
}
