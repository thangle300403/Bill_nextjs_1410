import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownView() {
  const content = `Nếu bạn đang tìm kiếm vợt cầu lông công thủ toàn diện, dưới đây là một số lựa chọn phù hợp cho người mới chơi:

1. **Vợt cầu lông Yonex Astrox 77 Pro**
   - **Giá**: 4,069,000 VNĐ (giảm 10%)
   - **Mô tả**: Vợt này có thiết kế nặng đầu, giúp tấn công mạnh mẽ nhưng vẫn dễ kiểm soát. Trang bị công nghệ Namd và Rotational Generator System, vợt cải thiện độ phục hồi và kiểm soát lực, rất phù hợp cho lối đánh công thủ toàn diện.

2. **Bao vợt cầu lông Yonex BA31**
   - **Giá**: 850,000 VNĐ (giảm 10%)
   - **Mô tả**: Bao vợt nhẹ, dễ mang theo, bảo vệ vợt khỏi va đập, giúp bảo quản và vận chuyển vợt an toàn.

3. **Bao vợt Cầu Lông Yonex 239BA002U**
   - **Giá**: 901,000 VNĐ
   - **Mô tả**: Bao vợt dành cho người chơi trung cấp, thiết kế bảo vệ vợt hiệu quả, chất liệu bền và nhẹ, dễ dàng di chuyển và bảo quản.

### Lời khuyên:
Vợt Yonex Astrox 77 Pro là lựa chọn tốt nhất cho người mới chơi vì nó dễ kiểm soát và hỗ trợ lối đánh công thủ toàn diện. 

Nếu bạn cần thêm thông tin về ngân sách hoặc phong cách chơi của mình, hãy cho tôi biết!`;
  return (
    <div className="markdown prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
