import { useEffect, useRef, useState } from "react";

export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
    );

    ws.current.onmessage = (event) => {
      setLastMessage(event);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const joinTaskRoom = (taskId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "JOIN_TASK", taskId }));
    }
  };

  const leaveTaskRoom = (taskId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "LEAVE_TASK", taskId }));
    }
  };

  const subscribeToTaskUpdates = (callback: (data: any) => void) => {
    if (!ws.current) return;

    const messageHandler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "TASK_UPDATED") {
        callback(data);
      }
    };

    ws.current.addEventListener("message", messageHandler);

    return () => {
      ws.current?.removeEventListener("message", messageHandler);
    };
  };

  return {
    lastMessage,
    joinTaskRoom,
    leaveTaskRoom,
    subscribeToTaskUpdates,
  };
}
