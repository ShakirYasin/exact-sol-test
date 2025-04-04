import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { TaskEventData } from "../types";

interface TaskUpdateEvent {
  type: string;
  data: TaskEventData;
}

export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState<TaskUpdateEvent | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.current.on("connect", () => {
      console.log(`Client connected: ${socket.current?.id}`);
    });

    socket.current.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.current?.id}`);
    });

    // return () => {
    //   if (socket.current) {
    //     socket.current.disconnect();
    //   }
    // };
  }, []);

  const subscribeToTaskUpdates = () => {
    if (!socket.current) return;

    socket.current.on("TASK_UPDATED", (event: TaskUpdateEvent) => {
      console.log("TASK_UPDATED", event);
      setLastMessage(event);
    });

    return () => {
      socket.current?.off("TASK_UPDATED");
    };
  };

  return {
    lastMessage,
    subscribeToTaskUpdates,
    socket: socket.current,
  };
}
