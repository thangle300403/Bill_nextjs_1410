// components/ProductUuDai.tsx

export default function ProductUuDai() {
  return (
    <div className="border border-dashed border-red-400 p-4 rounded-lg bg-white text-sm leading-6 space-y-2 shadow-sm">
      <h3 className="text-red-500 font-bold text-base flex items-center gap-2">
        🎁 ƯU ĐÃI
      </h3>
      <ul className="pl-4 list-disc text-gray-700 space-y-1">
        <li>Tặng 2 Quấn cán vợt Cầu Lông</li>
        <li>Sản phẩm cam kết chính hãng</li>
        <li>Một số sản phẩm sẽ được tặng bao đỡn hoặc bao nhung bảo vệ vợt</li>
        <li>Thanh toán sau khi kiểm tra và nhận hàng (Giao khung vợt)</li>
        <li>
          Bảo hành chính hãng theo nhà sản xuất{" "}
          <span className="italic">(Trừ hàng nội địa, xách tay)</span>
        </li>
      </ul>

      <h4 className="font-bold text-sm text-orange-500 mt-2">
        🎁 Ưu đãi thêm khi mua sản phẩm tại{" "}
        <span className="text-orange-600 font-bold">Premium</span>
      </h4>
      <ul className="pl-4 list-disc space-y-1 text-gray-700">
        <li>
          <span className="text-green-600 font-semibold">✔</span> Sơn logo mặt
          vợt <span className="text-orange-500 font-medium">miễn phí</span>
        </li>
        <li>
          <span className="text-green-600 font-semibold">✔</span> Bảo hành lưới
          đan trong <span className="text-orange-500 font-medium">72 giờ</span>
        </li>
        <li>
          <span className="text-green-600 font-semibold">✔</span> Thay gen vợt{" "}
          <span className="text-orange-500 font-medium">miễn phí trọn đời</span>
        </li>
        <li>
          <span className="text-green-600 font-semibold">✔</span> Tích lũy điểm
          thành viên <span className="font-semibold">Premium</span>
        </li>
        <li>
          <span className="text-green-600 font-semibold">✔</span> Voucher giảm
          giá cho lần mua hàng tiếp theo
        </li>
      </ul>
    </div>
  );
}
