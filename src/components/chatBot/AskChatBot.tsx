/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useUser } from "@/hooks/useUser";
import { axiosExpress } from "@/lib/axiosExpress";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { createLinkProductCard } from "@/lib/utils";
import { ProductCard } from "@/types/product";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArrowUpIcon, SquareIcon, Trash2Icon } from "lucide-react";
import LoaderAI from "./LoaderAI";

type NormalizedAI = {
  answer: string;
  products: ProductCard[];
};

function decodeStreamChunk(chunk: string) {
  return chunk
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function normalizeAIContent(raw: unknown): NormalizedAI {
  // Case 1: BE đã gửi object
  if (typeof raw === "object" && raw !== null && "answer" in raw) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      answer: String((raw as any).answer ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: Array.isArray((raw as any).products)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (raw as any).products
        : [],
    };
  }
  // Case 2: BE gửi JSON string
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.answer) {
        return {
          answer: parsed.answer,
          products: parsed.products ?? [],
        };
      }
    } catch {
      // ignore
    }
    // Case 3: text thuần
    return { answer: raw, products: [] };
  }
  // fallback
  return { answer: "", products: [] };
}

export default function AskChatbot() {
  const { user } = useUser();
  const [, setSessionId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string; created_at?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resizeInput = () => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const deleteChatHistory = async () => {
    try {
      const res = await axiosExpress.delete("/chatbot/delHis");

      if (res.data.success) {
        toast.success(`🗑 Đã xoá ${res.data.deleted} dòng tin nhắn gần nhất!`);

        setChatMessages((prev) => prev.slice(0, Math.max(prev.length - 30, 0)));
      } else {
        toast.error("Không thể xoá lịch sử.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xoá lịch sử!");
    }
  };

  const loadChatHistory = async () => {
    try {
      const res = await axiosExpress.get(`/chatbot/history`);
      const history = res.data;

      if (Array.isArray(history) && history.length > 0) {
        setChatMessages(history);
        console.log("✅ Lịch sử chat đã được tải.");
      } else {
        console.log("ℹ️ Bạn chưa có lịch sử chat nào.");
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      const status = axiosErr?.response?.status;

      if (status === 400) {
        console.log("⚠️ Không thể truy xuất lịch sử chat.");
      } else {
        toast.error("Lỗi khi tải lịch sử chat.");
        console.error("🔥 Error loading history:", axiosErr?.message);
      }
    }
  };

  // Auto scroll xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const initAndLoad = async () => {
      try {
        //  Step 1: Init session or email first
        await initSessionOrEmail();
        //  Step 2: Load chat history
        await loadChatHistory();
      } catch (err) {
        console.error("❌ Error during init + load:", err);
      }
    };

    const initSessionOrEmail = async () => {
      console.log("user", user);
      // ĐÃ LOGIN → KHÔNG TẠO SESSION
      if (user?.email) {
        console.log("✅ Logged in as:", user.email);
        setSessionId(null);
        return;
      }

      // CHƯA LOGIN → TẠO GUEST SESSION
      console.log("⚠️ Chưa đăng nhập, khởi tạo session guest...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_API_URL}/start-session`,
        { credentials: "include" },
      );

      const data = await res.json();
      if (data?.sessionId) {
        setSessionId(data.sessionId);
        console.log("✅ Guest Session ID:", data.sessionId);
      }
    };

    if (user === undefined) return;
    initAndLoad();
  }, [user]);

  useEffect(() => {
    console.log("👤 chatMessages updated:", chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const stopStreaming = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setLoading(false);
    setChatMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "ai" && !last.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input;
    setInput("");
    requestAnimationFrame(resizeInput);
    setLoading(true);

    console.log("🟢 USER QUESTION:", question);

    // 1️⃣ Add user message
    setChatMessages((prev) => {
      console.log("➕ add user message, prev length =", prev.length);
      return [...prev, { role: "user", content: question }];
    });

    // 2️⃣ Add empty assistant message (để stream vào)
    let assistantIndex: number;

    setChatMessages((prev) => {
      assistantIndex = prev.length;
      console.log("➕ add assistant placeholder at index =", assistantIndex);
      return [...prev, { role: "ai", content: "" }];
    });

    console.log("🌐 OPEN SSE CONNECTION");

    // 3️⃣ Open SSE
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat/stream?q=${encodeURIComponent(question)}`,
      { withCredentials: true },
    );
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log("✅ SSE CONNECTED");
    };

    es.onmessage = async (event) => {
      const chunk = event.data;

      if (chunk === "[DONE]") {
        toast.success("Trả lời đã hoàn tất!");
        es.close();
        eventSourceRef.current = null;
        setLoading(false);
        void loadChatHistory();
        return;
      }

      const decodedChunk = decodeStreamChunk(chunk);

      // 4️⃣ Append token vào assistant message
      setChatMessages((prev) => {
        const next = [...prev];

        if (!next[assistantIndex]) {
          console.error("❌ assistantIndex not found!", assistantIndex, next);
          return prev;
        }

        next[assistantIndex] = {
          ...next[assistantIndex],
          content: next[assistantIndex].content + decodedChunk,
        };

        return next;
      });
    };

    es.addEventListener("products", (event) => {
      console.log("🛒 FE RECEIVED PRODUCTS RAW:", event.data);

      try {
        const parsed = JSON.parse(event.data);
        console.log("🛒 FE PARSED PRODUCTS:", parsed);
        setProducts(parsed);
      } catch (err) {
        console.error("❌ FE FAILED TO PARSE PRODUCTS", err);
      }
    });

    es.onerror = (err) => {
      console.error("❌ SSE ERROR", err);
      es.close();
      eventSourceRef.current = null;
      setLoading(false);
      setProducts([]);
      void loadChatHistory();
    };
  };

  useEffect(() => {
    console.log("📦 FE products state updated:", products);
    console.log("📦 ENV IMAGE", process.env.NEXT_NODE_PUBLIC_IMAGE_BASE_URL);
  }, [products]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <img
          src="/images/ChatbotBill3.png"
          alt="Bill"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">Bill AI Assistant</p>
          <p className="text-xs text-green-600">● Online</p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <Trash2Icon className="w-8 h-8 text-red-500 hover:text-red-600 transition" />
        </button>
      </div>

      {/* chatMessages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gray-50">
        {chatMessages.map((msg, idx) => {
          if (msg.role === "ai") {
            const { answer, products } = normalizeAIContent(msg.content);
            const showMessageLoader =
              loading && idx === chatMessages.length - 1 && !answer.trim();

            return (
              <div key={idx} className="space-y-3">
                {/* TEXT */}
                <div className="markdown prose max-w-none">
                  {showMessageLoader ? (
                    <div className="flex h-16 items-center justify-start overflow-hidden">
                      <div className="origin-left scale-[0.35]">
                        <LoaderAI />
                      </div>
                    </div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {answer}
                    </ReactMarkdown>
                  )}
                </div>

                {/* PRODUCTS */}
                {products.length > 0 && (
                  <div className="space-y-2">
                    {products.map((p) => (
                      <Link
                        key={p.id}
                        href={createLinkProductCard(p)}
                        className="block"
                      >
                        <div className="flex items-center gap-3 rounded-xl border p-3 bg-gray-50">
                          <img
                            src={p.image}
                            className="h-16 w-16 rounded-md object-contain border"
                            alt={p.name}
                          />

                          <div className="flex-1">
                            <p className="font-semibold text-sm">{p.name}</p>

                            <p className="text-green-600 font-medium text-sm">
                              {p.price.toLocaleString()}đ
                              {p.discount > 0 && ` (-${p.discount}%)`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // USER
          return (
            <div key={idx} className="text-right">
              <div className="inline-block rounded-xl bg-blue-600 text-white p-3">
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Product cards */}
        {products.length > 0 && (
          <div className="mt-4 space-y-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={createLinkProductCard(p)}
                className="block"
              >
                <div className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm">
                  {/* Image */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 rounded-md object-contain border"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{p.name}</p>

                    <p className="text-sm text-green-600">
                      {p.price.toLocaleString()}đ
                      {p.discount > 0 && (
                        <span className="ml-2 text-red-500">
                          -{p.discount}%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            ref={inputRef}
            onChange={(e) => {
              setInput(e.target.value);
              requestAnimationFrame(resizeInput);
            }}
            onKeyDown={(e) => {
              // Enter = gửi, Shift+Enter = xuống dòng
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            placeholder="Nhập câu hỏi của bạn..."
            className="
        flex-1 resize-none rounded-xl border px-4 py-2 text-sm leading-5
        focus:outline-none focus:ring-2 focus:ring-blue-500
        min-h-10 max-h-[120px] overflow-y-auto
      "
          />

          <button
            onClick={loading ? stopStreaming : sendMessage}
            aria-label={loading ? "Dừng" : "Gửi"}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white text-[0px] transition ${
              loading
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <span className="hidden">{loading ? "Dừng" : "Gửi"}</span>
            {loading ? (
              <SquareIcon className="h-4 w-4 fill-current" />
            ) : (
              <ArrowUpIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[320px] text-center">
            <h3 className="text-lg font-bold mb-2 text-red-600">
              Xác nhận xóa lịch sử?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Hành động này sẽ xóa 30 tin nhắn gần nhất.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  await deleteChatHistory();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
