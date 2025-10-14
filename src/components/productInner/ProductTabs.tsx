import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Comment } from "@/types/product";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import CommentForm from "./CommentForm";

export default function ProductTabs({
  productId,
  description,
  comments: initialComments,
}: {
  productId: number;
  description: string;
  comments: Comment[];
}) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const fetchComments = async () => {
    try {
      const res = await axiosNonAuthInstanceNest.get(
        `/products/${productId}/comments`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "description"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Mô tả
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "reviews"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Đánh giá
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "description" && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <CommentForm
              productId={productId}
              refreshComments={fetchComments}
            />
            {comments.length > 0 ? (
              comments.map((c, idx) => (
                <div key={idx} className="border-b pb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{c.fullname}</span>
                    <span>{new Date(c.created_date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 text-yellow-500">⭐ {c.star}</div>
                  <p className="mt-2">{c.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
