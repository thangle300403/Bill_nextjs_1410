/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader"; // Update path if needed
import { axiosNonAuthInstanceNode } from "@/lib/utils";
import { Product } from "@/types/product";
import { useAnonLogs } from "@/hooks/useAnonLogs";
type ShirtTryOnProps = {
  product: Product[];
};
export default function ShirtTryOn({ product }: ShirtTryOnProps) {
  const [shirtOptions] = useState(product || []);
  const [filteredShirts, setFilteredShirts] = useState(product || []);
  const [selectedShirt, setSelectedShirt] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [resultVideo, setResultVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const { logs } = useAnonLogs();

  useEffect(() => {
    const filtered = shirtOptions.filter((shirt) =>
      shirt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredShirts(filtered);
  }, [searchQuery, shirtOptions]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUserImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("Vui lòng chọn hình ảnh hợp lệ!");
    }
  };

  const handleSubmit = async () => {
    if (!selectedShirt || !userImage) {
      toast.warning("Vui lòng chọn áo và tải ảnh cơ thể!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", userImage);
      formData.append("shirt", selectedShirt.name);
      formData.append("shirt_image_url", selectedShirt.featured_image);

      const res = await axiosNonAuthInstanceNode.post("/tryon", formData);
      console.log("AI Try-On Response:", res.data);

      setResultImage(res.data.generatedImageUrl);
      setResultVideo(res.data.generatedVideoUrl);

      setAiText(res.data.aiText);
      toast.success("Tạo ảnh thử đồ thành công!");
    } catch (err) {
      toast.error("Lỗi khi tạo ảnh thử đồ.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Thử áo với AI
      </h1>

      {/* Search + Shirt List */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-3">1. Chọn một chiếc áo:</h4>
        <input
          type="text"
          placeholder="Tìm áo theo tên..."
          className="border-2 border-black font-semibold text-black px-4 py-2 rounded-md w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex overflow-x-auto gap-4 py-2">
          {filteredShirts.map((shirt, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 border-2 rounded-xl p-3 cursor-pointer transition hover:scale-105 w-50 h-80 flex flex-col justify-between ${
                selectedShirt?.name === shirt.name
                  ? "border-green-500 ring-2 ring-green-300"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedShirt(shirt)}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={shirt.featured_image}
                  alt={shirt.name}
                  className="h-48 object-contain"
                />
              </div>
              <p className="text-center mt-2 text-sm font-medium line-clamp-2">
                {shirt.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Image */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-3">
          2. Tải ảnh toàn thân của bạn:
        </h4>

        <label
          htmlFor="file-upload"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          📷 Chọn ảnh của bạn
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full cursor-pointer rounded-lg border-2 border-green-500 bg-white px-4 py-2 text-sm font-medium text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-green-700 shadow-sm transition"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-48 h-auto rounded-lg shadow border mt-4"
          />
        )}
      </div>
      {/* your try-on UI */}
      {loading && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto text-sm">
          <h4 className="font-semibold mb-2">📡 Trạng thái xử lý AI:</h4>
          {logs.map((log, idx) => (
            <p key={idx} className="text-gray-700">
              [{new Date(log.ts).toLocaleTimeString()}] {log.msg}
            </p>
          ))}
        </div>
      )}
      {/* Submit Button */}
      {loading ? (
        <div className="flex items-center justify-center text-white">
          <Loader />
        </div>
      ) : (
        // <button
        //   onClick={handleSubmit}
        //   disabled={loading}
        //   className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-lg shadow transition active:scale-95 disabled:opacity-60"
        // ></button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="group relative outline-0 bg-sky-200 [--sz-btn:68px] [--space:calc(var(--sz-btn)/5.5)] [--gen-sz:calc(var(--space)*2)] [--sz-text:calc(var(--sz-btn)-var(--gen-sz))] h-[var(--sz-btn)] w-auto px-4 border border-solid border-transparent rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-transform duration-200 active:scale-[0.95] bg-[linear-gradient(45deg,#efad21,#ffd60f)] [box-shadow:#3c40434d_0_1px_2px_0,#3c404326_0_2px_6px_2px,#0000004d_0_30px_60px_-30px,#34343459_0_-2px_6px_0_inset]"
        >
          <svg
            className="animate-pulse absolute z-10 overflow-visible transition-all duration-300 text-[#ffea50] group-hover:text-white top-[calc(var(--sz-text)/7)] left-[calc(var(--sz-text)/7)] h-[var(--gen-sz)] w-[var(--gen-sz)] group-hover:h-[var(--sz-text)] group-hover:w-[var(--sz-text)] group-hover:left-[calc(var(--sz-text)/4)] group-hover:top-[calc(calc(var(--gen-sz))/2)]"
            stroke="none"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
            />
          </svg>
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="[font-size:var(--sz-text)] font-[Times_New_Roman] font-extrabold leading-none text-white transition-all duration-200">
              Thử ngay
            </span>

            <img
              src="/images/BillAI.png"
              alt="Shirt Icon"
              className="w-[var(--sz-btn)] h-[var(--sz-btn)] object-contain"
            />
          </div>
        </button>
      )}

      {/* Result Image */}
      {resultImage && (
        <div className="mt-10 text-center">
          <h4 className="text-lg font-semibold mb-3">📷 Kết quả AI:</h4>
          {aiText && (
            <p className="text-base text-gray-700 italic px-4 max-w-2xl mx-auto">
              {aiText}
            </p>
          )}
          <img
            src={resultImage}
            alt="AI Result"
            className="rounded-xl border shadow-lg max-w-full mx-auto mt-4"
          />
          <div className="mt-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => alert(`Bạn đã đánh giá ${star} sao!`)}
                className="text-yellow-400 text-2xl hover:scale-110 transition"
              >
                ★
              </button>
            ))}
          </div>

          {/* 🎬 New button appears only after image */}
          {!resultVideo && (
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await axiosNonAuthInstanceNode.post(
                    "/tryon/video",
                    {
                      imageUrl: resultImage,
                    }
                  );
                  setResultVideo(res.data.generatedVideoUrl);
                  toast.success("Đã tạo video 360° thành công!");
                } catch (err) {
                  toast.error("Lỗi khi tạo video.");
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
            >
              🎬 Tạo video 360°
            </button>
          )}

          <div className="mt-4">
            <a
              href={resultImage}
              download="ai-generated.png"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition"
            >
              📥 Tải ảnh xuống
            </a>
          </div>
        </div>
      )}

      {resultVideo && (
        <div className="mt-10 text-center">
          <h4 className="text-lg font-semibold mb-3">
            🎥 Video minh hoạ động:
          </h4>
          <video
            src={resultVideo}
            controls
            autoPlay
            loop
            muted
            className="rounded-xl border shadow-lg max-w-full mx-auto mt-4"
          />
          <p className="text-sm text-gray-500 mt-2">
            (Video preview sẽ hết hạn sau vài phút)
          </p>
        </div>
      )}
    </div>
  );
}
