import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu BillShop",
  description: "Tìm hiểu cửa hàng chúng tôi",
};

export const dynamic = "force-static";

export default async function AboutUsPage() {
  return (
    <main id="maincontent" className="py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 items-center">
            <li>
              <Link href="/" className="hover:underline text-blue-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-semibold">
              Giới thiệu về BillShop
            </li>
          </ol>
        </nav>

        <div className="bg-white border border-gray-200 p-6 rounded shadow-sm leading-relaxed text-gray-700 space-y-4">
          <div className="max-w-screen-lg mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-bold text-green-700 mb-6">
              Giới thiệu về BillShop
            </h1>

            <section className="space-y-4">
              <p>
                <strong>BillShop</strong> là nền tảng thương mại điện tử chuyên
                cung cấp các sản phẩm cầu lông chính hãng tại Việt Nam. Chúng
                tôi không chỉ cung cấp vợt, giày, balo, áo quần mà còn mang đến
                trải nghiệm mua sắm hiện đại với công nghệ AI.
              </p>

              <p>
                Sứ mệnh của chúng tôi là giúp người chơi cầu lông – từ người mới
                bắt đầu đến vận động viên chuyên nghiệp – dễ dàng tiếp cận các
                sản phẩm chất lượng cao, chính hãng, với giá thành hợp lý và
                dịch vụ tận tâm.
              </p>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-green-600">
                Công nghệ nổi bật
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Thử áo bằng AI</strong> – cho phép người dùng ướm thử
                  áo trực tuyến để đánh giá màu sắc và kiểu dáng phù hợp.
                </li>
                <li>
                  <strong>Chatbot Bill Cipher</strong> – tư vấn sản phẩm, trả
                  lời câu hỏi 24/7 như một chuyên gia cầu lông thực thụ.
                </li>
              </ul>
            </section>

            <section className="mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-green-600">
                Cam kết từ BillShop
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Sản phẩm chính hãng từ các thương hiệu uy tín: Yonex, Lining,
                  Victor,...
                </li>
                <li>Chính sách đổi trả rõ ràng, minh bạch.</li>
                <li>Giao hàng toàn quốc – thanh toán linh hoạt.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">
                Liên hệ
              </h2>
              <p>
                📞 Hotline: <strong>0868 389 830</strong>
                <br />
                📍 Địa chỉ: 123 Đường Cầu Lông, Quận 9, TP.HCM
                <br />
                ✉️ Email: <strong>support@billshop.vn</strong>
                <br />
                🌐 Website:{" "}
                <a
                  href="https://billshop.vn"
                  className="text-blue-600 hover:underline"
                >
                  https://billshop.vn
                </a>
              </p>
            </section>
          </div>
        </div>
        {/* Page Content */}
      </div>
    </main>
  );
}
