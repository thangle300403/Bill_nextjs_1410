// useChatLogs.ts
import { useEffect, useState } from "react";

export function useChatLogs(sessionId: string | null) {
  const [logs, setLogs] = useState<{ ts: number; msg: string }[]>([]);

  useEffect(() => {
    let es: EventSource | null = null;

    const connect = () => {
      const url = sessionId
        ? `${process.env.NEXT_PUBLIC_NODE_API_URL}/chatbot/stream-logs?session_id=${sessionId}`
        : `${process.env.NEXT_PUBLIC_NODE_API_URL}/chatbot/stream-logs`;

      console.log("🔌 Connecting to SSE at:", url);

      es = new EventSource(url, { withCredentials: true });

      es.onmessage = (event) => {
        console.log("📡 Raw SSE data:", event.data);
        try {
          const data = JSON.parse(event.data);
          console.log("✅ Parsed data:", data);
          setLogs([data]);
        } catch {}
      };

      es.onerror = () => {
        console.warn("🔌 SSE disconnected. Reconnecting...");
        es?.close();
        setTimeout(connect, 2000); // Tự reconnect sau 2s
      };
    };

    connect(); // Gọi ngay khi mount

    return () => {
      es?.close();
    };
  }, [sessionId]);

  return { logs, setLogs }; // 👈 export setLogs luôn
}
