import Link from "next/link";
import React from "react";

export default function DeliveryPolicyPage() {
  return (
    <>
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
                Chính sách giao hàng
              </li>
            </ol>
          </nav>

          {/* Heading */}
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Chính sách giao hàng
          </h4>

          {/* Content */}
          <div className="bg-white border border-gray-200 p-6 rounded shadow-sm leading-relaxed text-gray-700 space-y-4">
            <div>
              <p className="font-semibold">Phạm vi giao hàng</p>
              <p>
                Hiện tại cửa hàng của chúng tôi đã hỗ trợ giao hàng trên toàn
                quốc. Dù bạn có ở bất kỳ nơi đâu trên lãnh thổ Việt Nam, chúng
                tôi đều có thể gửi hàng trực tiếp đến tận tay của bạn.
              </p>
            </div>

            <div>
              <p className="font-semibold">Thời gian giao hàng</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Đối với khách hàng ở Hồ Chí Minh, thời gian giao hàng sẽ từ 02
                  - 03 ngày làm việc.
                </li>
                <li>
                  Đối với khách hàng ở các tỉnh, thành phố còn lại thì thời gian
                  giao hàng dự kiến từ 03 - 07 ngày kể từ lúc bạn lên đơn hàng.
                </li>
              </ul>
              <p className="mt-2">
                <span className="font-medium">Lưu ý:</span> Thời gian giao hàng
                được bắt đầu tính sau khi đơn hàng của quý khách được xác nhận
                thành công bằng cuộc gọi của nhân viên chăm sóc khách hàng của
                chúng tôi.
              </p>
            </div>

            <div>
              <p className="font-semibold">Phí giao hàng</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Đối với khách hàng ở Hồ Chí Minh thì quý khách sẽ chịu phí vận
                  chuyển giao hàng 15,000 đ/đơn hàng (đã bao gồm VAT).
                </li>
                <li>
                  Còn các khách hàng ở các tỉnh thành còn lại, chúng tôi sẽ dựa
                  vào địa điểm bạn đang sinh sống.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Hủy đơn hàng</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Đơn hàng của bạn sẽ bị hủy nếu sau 03 lần nhân viên giao hàng
                  hay nhân viên chăm sóc khách hàng liên lạc với bạn.
                </li>
                <li>
                  Nếu bạn đã nhận đơn hàng nhưng không đồng ý nhận sản phẩm vì
                  một lý do nào đó, thì bạn sẽ là người trực tiếp thanh toán
                  tiền vận chuyển cho nhân viên giao nhận.
                </li>
                <li>
                  Nếu đơn hàng của bạn đã được đóng gói và chưa được gửi đi, bạn
                  có quyền được hủy đơn hàng mà không phải chịu bất cứ chi phí
                  phát sinh nào cả.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
