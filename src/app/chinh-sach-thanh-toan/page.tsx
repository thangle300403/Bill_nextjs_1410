import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách thanh toán",
  description: "Tìm hiểu chính sách thanh toán của cửa hàng chúng tôi",
};

export const dynamic = "force-static";

export default async function PaymentPolicyPage() {
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
              Chính sách thanh toán
            </li>
          </ol>
        </nav>

        {/* Page Heading */}
        <h4 className="text-xl font-semibold text-gray-900 mb-4" id="giao-hang">
          Chính sách thanh toán
        </h4>

        {/* Page Content */}
        <div className="bg-white border border-gray-200 p-6 rounded shadow-sm leading-relaxed text-gray-700 space-y-4">
          <p>
            Hiện tại cửa hàng chúng tôi hỗ trợ 02 hình thức thanh toán, giúp bạn
            chủ động và thuận tiện hơn trong quá trình giao hàng:
          </p>
          <p className="font-semibold">Thanh toán trực tuyến trên website</p>
          <p>
            Đối với hình thức này, sau khi bạn đã tạo đơn hàng thành công ở trên
            website bạn vui lòng chuyển khoản tổng giá trị đơn hàng qua tài
            khoản sau đây:
          </p>
          <p>Thông tin chuyển khoản:</p>
          <p>
            Tên chủ tài khoản: Nguyễn Hữu Lộc
            <br />
            Số tài khoản: 0421003707901
            <br />
            Ngân hàng: Vietcombank
            <br />
            Chi nhánh: HCM
          </p>
          <p>Lưu ý: Khi bạn chuyển khoản, vui lòng nhập tên người mua hàng.</p>
          <p>
            Sau khi bạn đã thanh toán và chuyển khoản xong, chúng tôi sẽ giao
            hàng đến cho bạn theo thời gian quy định tại “Chính sách giao hàng”
            của chúng tôi.
          </p>
          <p className="font-semibold">
            Thanh toán khi nhận hàng (COD - Cash On Delivery)
          </p>
          <p>
            Với hình thức thanh toán khi nhận hàng, bạn sẽ chỉ thanh toán khi
            đơn hàng đến tay của bạn và bạn chỉ cần trả đúng số tiền in trên hóa
            đơn. Nếu bạn thấy giá trị trên hóa đơn không chính xác, bạn vui lòng
            liên hệ lại ngay cho chúng tôi qua số Hotline:
            <span className="font-medium text-red-600"> 0932.538.468</span>
          </p>
        </div>
      </div>
    </main>
  );
}
