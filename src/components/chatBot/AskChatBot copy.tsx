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

export default function AskChatbot() {
  const [question, setQuestion] = useState("");
  const [showFAQs, setShowFAQs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const addToCart = useCartStore.getState().addToCart;

  const submitChatMessage = async (messageToSend: string) => {
    setLoading(true);
    setQuestion("");

    // Push user message first
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: messageToSend },
    ]);

    try {
      const res = await axiosExpress.post(`/chatbot`, {
        question: messageToSend,
      });
      const data = res.data;

      // Push AI messages
      if (data.aiMessages && Array.isArray(data.aiMessages)) {
        setChatMessages((prev) => [...prev, ...data.aiMessages]);
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
    const loadChatHistory = async () => {
      try {
        const res = await axiosExpress.get(`/chatbot/history`);
        setChatMessages(res.data); // assumes array of { role, content }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error(`Error loading history: ${errorMessage}`);
        toast.warning("Hãy đăng nhập để xem lịch sử chat!");
      }
    };

    loadChatHistory();
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
        <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-32">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] px-4 py-3 rounded-2xl text-base shadow transition whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
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
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Form at Bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (question.trim()) {
              submitChatMessage(question.trim());
            }
          }}
          className="px-4 py-4 flex items-center gap-3 border-t shadow-md bg-white z-10"
        >
          <input
            className="flex-1 px-6 py-4 border border-blue-200 rounded-xl text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi cho Bill..."
            required
          />

          {loading ? (
            <LoaderAI />
          ) : (
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 transition text-white font-bold px-6 py-3 rounded-xl text-lg shadow active:scale-95"
              disabled={loading}
            >
              GỬI
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
