/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function useAnonLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_NODE_API_URL}/chatbot/stream-anon-logs`;
    console.log("🔌 Connecting to anon SSE:", url);

    const evtSource = new EventSource(url);

    evtSource.onopen = () => console.log("✅ Anon SSE opened");

    evtSource.onmessage = (e) => {
      console.log("📡 Raw SSE:", e.data);
      try {
        const payload = JSON.parse(e.data);
        setLogs((prev) => [...prev, payload]);
      } catch (err) {
        console.error("❌ Parse error", err, e.data);
      }
    };

    evtSource.onerror = (err) => {
      console.error("❌ Anon SSE error", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, []);

  return { logs, setLogs };
}
