/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import LoaderAI from "./LoaderAI";
import { useCartStore } from "@/store/cartStore";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { axiosExpress } from "@/lib/axiosExpress";
import { useChatLogs } from "@/hooks/useChatLogs";
import { axiosAuth } from "@/lib/axiosAuth";
import { useRef } from "react";

export default function AskChatbot() {
  const [question, setQuestion] = useState("");
  const [showFAQs, setShowFAQs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // const { logs, setLogs } = useChatLogs(sessionId);
  const { logs } = useChatLogs(sessionId);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string; created_at?: string }[]
  >([]);

  const addToCart = useCartStore.getState().addToCart;

  const submitWebSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `🌐 Web Search: ${query}`,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const res = await axiosExpress.post(`/chatbot/websearch`, { query });
      const data = res.data;

      if (data.aiMessages && Array.isArray(data.aiMessages)) {
        setChatMessages((prev) => [...prev, ...data.aiMessages]);
      }
    } catch (err) {
      toast.error("❌ Lỗi khi tìm kiếm web!");
      console.error(err);
    }

    setLoading(false);
  };

  const submitChatMessage = async (messageToSend: string) => {
    setLoading(true);
    setQuestion("");

    // Push user message first
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: messageToSend,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const res = await axiosExpress.post(`/chatbot`, {
        question: messageToSend,
      });
      const data = res.data;

      // Push AI messages
      if (data.aiMessages && Array.isArray(data.aiMessages)) {
        setChatMessages((prev) => [...prev, ...data.aiMessages]);
        // setLogs([]);
      }

      // Add to cart logic
      if (
        data.cartOutput &&
        data.cartOutput.action === "add_to_cart" &&
        data.cartOutput.item
      ) {
        addToCart({
          id: data.cartOutput.item.id,
          name: data.cartOutput.item.name,
          sale_price: Number(data.cartOutput.item.sale_price),
          imageUrl: data.cartOutput.item.imageUrl || "",
          quantity: data.cartOutput.item.quantity || 1,
        });
        toast.success(
          `🛒 Đã thêm "${data.cartOutput.item.name}" vào giỏ hàng!`
        );
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      if (axiosErr?.response?.status === 401) {
        toast.warning("Hãy đăng nhập để chat với Bill!");
      } else {
        toast.error("Lỗi hệ thống! Vui lòng thử lại.");
      }
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const initSessionOrEmail = async () => {
      try {
        // 🔐 Check login trạng thái từ FE
        const res = await axiosAuth.get("/me");
        const user = res.data;
        if (user?.email) {
          console.log("✅ Logged in as:", user.email);
          setSessionId(null); // Sử dụng email làm key
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Chưa login → dùng session
      }

      // 🟡 Nếu chưa login → dùng session_id từ cookie hoặc khởi tạo mới
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_API_URL}/start-session`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data?.sessionId) {
          setSessionId(data.sessionId);
          console.log("✅ Guest Session ID:", data.sessionId);
        }
      } catch (err) {
        console.error("❌ Lỗi khi gọi /start-session:", err);
      }
    };

    const loadChatHistory = async () => {
      try {
        const res = await axiosExpress.get(`/chatbot/history`);
        const history = res.data;

        if (Array.isArray(history) && history.length > 0) {
          setChatMessages(history);
        } else {
          console.log("Bạn chưa có lịch sử chat nào.");
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        const status = axiosErr?.response?.status;

        if (status === 400) {
          console.log("Không thể truy xuất lịch sử chat.");
        } else {
          toast.error("Lỗi khi tải lịch sử chat.");
          console.error("Error loading history:", axiosErr?.message);
        }
      }
    };

    initSessionOrEmail();
    loadChatHistory();
    console.log("📦 Current sessionId:", sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FAQs = [
    "Chính sách đổi trả như thế nào và vợt cho người mới chơi ??",
    "chính sách đổi trả và giá vợt cầu lông yonex astrox 77 pro ??",
    "tôi muốn thêm yonex duora z strike vào giỏ hàng",
    "Các sản phẩm bán chạy nhất tháng rồi?",
    "Chính sách đổi trả như thế nào?",
    "Liệt kê các đơn hàng đã bị hủy của tôi?",
    "Hủy đơn hàng số 13.",
  ];

  return (
    <div
      style={{
        maxWidth: "100%",
        padding: "0 20px",
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-full h-[80vh] flex flex-col">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-center text-red-700 tracking-wide p-4">
          Trợ lý AI - Bill Cipher
        </h2>

        <button
          type="button"
          onClick={() => setShowFAQs((prev) => !prev)}
          className="w-[300px] mx-auto mb-2 px-2 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-lg font-medium shadow transition"
        >
          {showFAQs ? "Ẩn câu hỏi thường gặp" : "Các câu hỏi thường gặp"}
        </button>

        {/* FAQ Buttons */}
        {showFAQs && (
          <div className="mb-2 px-4 flex flex-wrap gap-2">
            {FAQs.map((faq, i) => (
              <button
                key={i}
                type="button"
                className="bg-yellow-50 hover:bg-yellow-100 text-orange-700 rounded-full px-3 py-1 text-sm font-medium shadow transition border border-yellow-100"
                onClick={() => setQuestion(faq)}
              >
                {faq}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Chat Area */}
        <div
          className="flex-1 overflow-y-auto space-y-4 px-4 pb-32"
          ref={chatContainerRef}
        >
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[90%] px-5 py-3 rounded-2xl text-base shadow-md whitespace-pre-wrap transition-all
    ${
      msg.role === "user"
        ? "bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-opacity-30 backdrop-blur-md border border-white/30 shadow-md text-gray-900 font-medium px-5 py-3 rounded-2xl"
        : "bg-green-50 text-green-900 text-4xl font-['Lora'] border-2 border-green-300 shadow-md p-6 rounded-md"
    }`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    button: (props) => {
                      const node = props.node as any;
                      const dataMsg =
                        node?.properties?.dataMsg ||
                        node?.properties?.dataProduct;
                      return (
                        <button
                          className="bg-green-600 text-white px-3 py-2 rounded mt-2 ml-2 hover:bg-green-700 active:scale-95 text-sm"
                          onClick={() => {
                            if (!dataMsg) return;
                            const messageToSend = decodeURIComponent(dataMsg);
                            submitChatMessage(messageToSend);
                          }}
                        >
                          {props.children}
                        </button>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>

                <span className="text-xs text-gray-400">
                  {new Date(
                    (msg.created_at ?? "").replace(" ", "T")
                  ).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {logs.length > 0 && (
          <div className="bg-white border border-yellow-300 rounded-lg p-4 text-sm font-mono shadow-inner max-h-48 overflow-y-auto space-y-1">
            <div>
              <span className="text-gray-400 text-xs">
                {new Date(logs[0].ts).toLocaleTimeString("vi-VN")}:
              </span>
              {logs[0].msg}
            </div>
          </div>
        )}

        {/* Fixed Form at Bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (question.trim()) {
              submitChatMessage(question.trim());
            }
          }}
          className="px-4 py-4 flex flex-col sm:flex-row items-center gap-3 border-t shadow-md bg-white z-10"
        >
          {/* Input field */}
          <input
            className="flex-1 px-4 py-3 border border-blue-200 rounded-xl text-base sm:text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi cho Bill..."
            required
          />

          {/* Buttons */}
          {loading ? (
            <LoaderAI />
          ) : (
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 transition text-white font-bold px-6 py-3 rounded-xl text-base sm:text-lg shadow active:scale-95 w-full sm:w-auto"
                disabled={loading}
              >
                GỬI
              </button>

              <button
                type="button"
                onClick={() => submitWebSearch(question)}
                className="bg-green-400 hover:bg-green-500 transition text-white font-bold px-6 py-3 rounded-xl text-base sm:text-lg shadow active:scale-95 w-full sm:w-auto"
                disabled={loading}
              >
                Search web
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
