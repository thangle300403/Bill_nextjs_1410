import { compressToUTF16, decompressFromUTF16 } from "lz-string";

const LOCAL_STORAGE_KEY = "chatbot_history_compressed";

export function saveMessageToLocalHistory(newMessage: {
  role: string;
  content: string;
}) {
  const compressed = localStorage.getItem(LOCAL_STORAGE_KEY);
  const decompressed = compressed ? decompressFromUTF16(compressed) : "[]";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const history: any[] = JSON.parse(decompressed || "[]");

  const newEntry = {
    ...newMessage,
    created_at: new Date().toISOString(),
  };

  const updated = [...history, newEntry];

  // Optional: Giới hạn tối đa 50 dòng
  const trimmed = updated.slice(-50);

  const updatedCompressed = compressToUTF16(JSON.stringify(trimmed));
  localStorage.setItem(LOCAL_STORAGE_KEY, updatedCompressed);
}

export function getLocalHistory(): {
  role: string;
  content: string;
  created_at: string;
}[] {
  const compressed = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!compressed) return [];
  try {
    const decompressed = decompressFromUTF16(compressed);
    return JSON.parse(decompressed || "[]");
  } catch {
    return [];
  }
}

export function clearLocalHistory() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
