/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";

export function useAnonLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      const url = `${process.env.NEXT_PUBLIC_NODE_API_URL}/chatbot/stream-anon-logs`;
      console.log("🔌 Connecting to anon SSE:", url);

      const evt = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = evt;

      evt.onopen = () => console.log("✅ Anon SSE opened");

      evt.onmessage = (e) => {
        // ping message (": ping\n\n") không có data
        if (!e.data?.trim() || e.data.startsWith(":")) return;
        console.log("📡 Raw SSE:", e.data);

        try {
          const payload = JSON.parse(e.data);
          if (payload.msg) setLogs((prev) => [...prev, payload]);
        } catch (err) {
          console.error("❌ Parse error", err, e.data);
        }
      };

      evt.onerror = (err) => {
        console.warn("⚠️ SSE disconnected, retrying in 3s...", err);
        evt.close();
        setTimeout(connect, 3000); // 🔁 auto reconnect
      };
    };

    connect();
    return () => {
      eventSourceRef.current?.close();
      console.log("❌ SSE closed");
    };
  }, []);

  const clearLogs = () => setLogs([]);

  return { logs, clearLogs };
}
