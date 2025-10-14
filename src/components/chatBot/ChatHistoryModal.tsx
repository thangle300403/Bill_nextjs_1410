"use client";

import { HistoryItem } from "@/types/chatbot";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface ChatHistoryModalProps {
  history: HistoryItem[];
  onClose: () => void;
}
export default function ChatHistoryModal({
  history,
  onClose,
}: ChatHistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 shadow-lg max-w-3xl w-full flex flex-col max-h-[80vh]">
        {/* Header cố định */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 text-center">
            🧠 Lịch sử hỏi đáp
          </h2>
          <div className="text-center mt-4">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-lg shadow active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Nội dung scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="font-semibold text-gray-700 mb-2">
                Câu hỏi: {item.question}
              </div>

              <div
                className="text-blue-700 mb-4 leading-relaxed whitespace-pre-wrap"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    button: (props) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const node = props.node as any;
                      const dataMsg =
                        node?.properties?.dataMsg ||
                        node?.properties?.dataProduct;

                      return (
                        <button
                          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md transition active:scale-95"
                          onClick={() => {
                            if (!dataMsg) return;
                            // 🔥 Gọi lại API gửi câu hỏi ngay từ lịch sử
                            // ⚠️ Bạn có thể truyền `submitChatMessage` làm prop vào đây nếu cần
                            toast.info(
                              "Bạn đã chọn lại câu hỏi từ lịch sử. Gửi lại bằng tay."
                            );
                          }}
                        >
                          {props.children}
                        </button>
                      );
                    },
                  }}
                >
                  {(() => {
                    try {
                      const msg = JSON.parse(item.ai_answer);
                      return msg;
                    } catch {
                      return (
                        item.ai_answer
                          ?.replace(/^"|"$/g, "")
                          .replace(/\\n/g, "\n") || ""
                      );
                    }
                  })()}
                </ReactMarkdown>
              </div>

              <div className="text-gray-500 text-sm text-right">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
