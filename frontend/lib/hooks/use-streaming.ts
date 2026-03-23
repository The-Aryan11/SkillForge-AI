import { useState, useCallback } from "react";

export function useStreaming() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const startStream = useCallback(async (url: string, body: unknown, onEvent: (e: any) => void) => {
    setIsStreaming(true);
    setEvents([]);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6));
            setEvents((prev) => [...prev, event]);
            onEvent(event);
          } catch {}
        }
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { isStreaming, events, startStream };
}
