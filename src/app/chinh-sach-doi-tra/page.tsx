import Link from "next/link";
import React from "react";

export default function ReturnPolicyPage() {
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
            <li className="text-gray-800 font-semibold">Chính sách đổi trả</li>
          </ol>
        </nav>

        {/* Heading */}
        <h4 className="text-xl font-semibold text-gray-900 mb-4" id="giao-hang">
          Chính sách đổi trả
        </h4>

        {/* Content */}
        <div className="bg-white border border-gray-200 p-6 rounded shadow-sm leading-relaxed text-gray-700 space-y-4">
          {/* Điều kiện đổi trả */}
          <div>
            <p className="font-semibold">Điều kiện đổi trả:</p>
            <p>Shop sẽ chấp nhận đổi trả cho các trường hợp sau đây:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Sản phẩm bị hư hỏng do quá trình vận chuyển. Ví dụ: quần áo bị
                lấm bẩn hoặc ướt, sản phẩm không còn hình dạng giống như ban
                đầu, …
              </li>
              <li>
                Sản phẩm bị hư hỏng trong quá trình sản xuất. Ví dụ: quạt điện
                không thể điều chỉnh được tốc độ, bếp điện có nhiệt độ bất
                thường, …
              </li>
              <li>
                Sản phẩm không giống như những gì bạn được nghe, thấy và nhìn ở
                trên website hay từ nhân viên tư vấn. Ví dụ: Bạn đặt mua Iphone
                X chính hãng nhưng chỉ nhận được một chiếc Iphone X Trung Quốc,
                …
              </li>
            </ul>
            <p>
              Nếu như sản phẩm của bạn không nằm trong những mục ở trên, chúng
              tôi có quyền được từ chối yêu cầu đổi trả của quý khách.
            </p>
          </div>

          {/* Thời gian đổi trả */}
          <div>
            <p className="font-semibold">Thời gian đổi trả:</p>
            <p>
              Thời gian đổi trả cố định trong vòng 07 ngày đối với khách hàng ở
              khu vực trung tâm Hồ Chí Minh. Còn đối với các khách hàng ở các
              tỉnh khác, thời gian bảo hành được kéo dài đến 14 ngày kể từ ngày
              mua hàng.
            </p>
          </div>

          {/* Quy định đổi trả */}
          <div>
            <p className="font-semibold">Quy định đổi trả:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Cùng mã sản phẩm (chỉ đổi size, đổi màu): Đổi miễn phí</li>
              <li>Khác mã sản phẩm:</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Nếu sản phẩm mới (sản phẩm muốn đổi) có giá trị &gt; giá trị sản
                phẩm cũ (dựa theo hóa đơn thanh toán): Khách hàng sẽ bù thêm chi
                phí để đổi lấy sản phẩm mới theo công thức (Giá trị sản phẩm
                mới) - (Giá trị sản phẩm cũ).
              </li>
              <li>
                Nếu sản phẩm mới (sản phẩm muốn đổi) có giá trị &lt; giá trị sản
                phẩm cũ (dựa theo hóa đơn thanh toán): Khách hàng sẽ được nhận
                lại tiền thừa theo công thức (Giá trị sản phẩm cũ) - (Giá trị
                sản phẩm mới).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
