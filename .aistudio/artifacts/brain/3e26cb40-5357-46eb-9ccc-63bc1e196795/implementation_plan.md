# Kế hoạch nâng cấp Pet AI: Gắn liền bài học & Phân tích lỗi sai thông minh

Tài liệu này vạch ra giải pháp kiến trúc và kế hoạch triển khai chi tiết nhằm nâng cấp Pet AI từ một khung hỏi đáp chung thành **Trợ lý sư phạm thông minh đồng hành cùng bài học**.

---

## 1. Mục tiêu và Yêu cầu cốt lõi

Dựa trên yêu cầu của bạn và các lựa chọn đã được thống nhất:
1. **Vị trí học sinh làm bài**: Bổ sung tab **"✍️ Luyện tập"** trực tiếp trong trang chi tiết bài học (`LessonView.tsx`), hiển thị các bài tập trắc nghiệm của bài học.
2. **Kích hoạt hỗ trợ**: Ngay khi học sinh chọn sai phương án, hiển thị ngay nút nổi bật: **🐾 "Hỏi Pet vì sao sai"**.
3. **Mở Pet AI kèm ngữ cảnh sư phạm**: Cửa sổ Pet AI tự động mở với đầy đủ ngữ cảnh bài toán (đề bài, các lựa chọn, câu trả lời học sinh đã chọn, nội dung bài học).
4. **Phân tích lỗi & Gợi ý từng bước**: Pet AI phân tích và chỉ điểm chính xác học sinh đã nhầm ở đâu (ví dụ: nhầm diện tích xung quanh với diện tích toàn phần, nhầm với thể tích, quên quy đổi cùng đơn vị đo, sai sót tính toán...). Sau đó, Pet AI hướng dẫn từng bước tư duy thay vì đưa ngay đáp án cuối cùng.
5. **Sinh bài tập tương tự có chấm điểm trực tiếp**: Pet AI tự động sinh một câu hỏi tương tự dưới dạng **Thẻ bài tập tương tác (Interactive Quiz Card)** có các lựa chọn A, B, C, D để học sinh chọn và kiểm tra kết quả ngay trong khung chat của Pet AI.

---

## 2. Kiến trúc giải pháp (Architecture & Data Flow)

```
[Tab Luyện tập trong LessonView]
       │
       ├─ Học sinh chọn đáp án sai
       │
       ▼
[Nút: "Hỏi Pet vì sao sai"]
       │
       │ (Truyền Context: Đề bài, Đáp án chọn, Đáp án đúng, Chủ đề bài học)
       ▼
[PetAIAssistant] (Mở Modal / Contextual Mode)
       │
       ▼ (Gửi request đến /api/chat với prompt chuyên sâu sư phạm Socratic)
[/api/chat (Backend Gemini 3.8 Flash)]
       │
       ├─ 1. Chỉ ra điểm nhầm cụ thể (Misconception Analysis)
       ├─ 2. Gợi ý từng bước hướng dẫn tư duy (Step-by-step Socratic Guidance)
       └─ 3. Sinh câu hỏi tương tự có cấu trúc JSON để render Thẻ tương tác
       │
       ▼
[Interactive Practice Card trong Chat Pet AI]
       │
       └─ Học sinh chọn đáp án -> Chấm điểm tức thì -> Pet chúc mừng & thưởng XP!
```

---

## 3. Các bước triển khai chi tiết

### Giai đoạn 1: Bổ sung Tab Luyện tập trong `LessonView.tsx`
- Bổ sung tab **"LUYỆN TẬP"** song song với Video, Đọc nội dung và Mini Game.
- Hiển thị danh sách câu hỏi của bài học (từ `lesson.questions` hoặc bộ câu hỏi luyện tập chất lượng cao theo chủ đề hình học / số học lớp 7).
- Hỗ trợ giao diện làm trắc nghiệm:
  - Chọn đáp án A, B, C, D với phản hồi màu sắc rõ ràng (xanh khi đúng, đỏ khi sai).
  - Khi làm sai: Hiển thị giải thích sơ bộ kèm nút ấn tượng: **🐾 "Hỏi Pet vì sao sai"**.
  - Tính điểm hoàn thành và thưởng điểm, XP nuôi Pet khi hoàn thành bài tập.

### Giai đoạn 2: Cầu nối thông tin giữa LessonView và Pet AI Assistant
- Mở rộng state điều khiển của Pet AI trong Store hoặc Event/Props:
  - Cung cấp hàm `openPetWithDiagnosticContext({ lessonName, question, selectedOption, correctOption, hint })`.
  - Giữ nguyên giao diện cài đặt 2 lớp API Key (Cá nhân & Vercel mặc định) mà bạn đã có.

### Giai đoạn 3: Tối ưu hóa System Prompt sư phạm cho Pet AI
Cập nhật prompt sư phạm chuyên biệt khi học sinh yêu cầu phân tích lỗi sai:
- **Nguyên tắc Socratic**: Tuyệt đối không đọc ngay đáp án cuối cùng.
- **Bắt bệnh lỗi sai**:
  - Nhầm công thức (diện tích xung quanh $S_{xq} = 2(a+b)h$ vs thể tích $V = a \cdot b \cdot h$ hay diện tích toàn phần $S_{tp} = S_{xq} + 2S_đ$).
  - Quên đổi đơn vị đo (ví dụ: mét sang centimét, $dm^3$ sang lít).
  - Tính nhầm bước cộng trước nhân sau hoặc dấu ngoặc.
- **Phong cách thân thiện, đáng yêu**: Xưng hô "Tớ - Cậu" hoặc "Pet - Bạn nhỏ", khích lệ tinh thần học tập.
- **Sinh câu hỏi tương tự chuẩn format**: Kèm thẻ câu hỏi tương tự với cú pháp nhận diện dễ dàng (hoặc JSON block) để render UI bấm chọn.

### Giai đoạn 4: Thẻ bài tập tương tác (Interactive Quiz Card) trong Pet AI
- Khi Pet AI phản hồi có bài tập tương tự, Pet AI sẽ render một Widget trắc nghiệm ngay bên dưới tin nhắn:
  - Hiển thị đề bài câu tương tự.
  - 4 nút chọn A, B, C, D tương tác trực tiếp.
  - Nút "Kiểm tra đáp án" -> Phản hồi đúng/sai ngay lập tức.
  - Nếu học sinh làm đúng: Pet AI nhảy múa chúc mừng, cộng thưởng thêm XP và điểm đói/vui cho Pet!

### Giai đoạn 5: Dữ liệu mẫu & Bài tập thực tế môn Toán
- Bổ sung ngân hàng câu hỏi mẫu chuẩn chương trình môn Toán (đặc biệt các bài dễ gây nhầm lẫn: Hình hộp chữ nhật, hình lập phương, lăng trụ đứng, số hữu tỉ...).
- Đảm bảo giáo viên vẫn có thể thêm/sửa/xóa câu hỏi trong trang Quản lý bài học (Admin/Teacher Lessons).

---

## 4. Kế hoạch kiểm thử (Verification Plan)

| Trường hợp kiểm thử | Kịch bản thực hiện | Kết quả mong đợi |
| :--- | :--- | :--- |
| **1. Trải nghiệm làm bài** | Mở một bài học -> Chọn tab Luyện tập -> Chọn một đáp án sai | Giao diện báo sai màu đỏ cam và nút **"Hỏi Pet vì sao sai"** xuất hiện nổi bật. |
| **2. Phân tích lỗi chính xác** | Bấm **"Hỏi Pet vì sao sai"** ở câu nhầm công thức diện tích xung quanh | Khung Pet AI tự động mở, Pet chỉ đúng việc học sinh nhầm sang thể tích hoặc toàn phần, đưa gợi ý gợi mở. |
| **3. Làm câu hỏi tương tự** | Học sinh đọc gợi ý và làm câu hỏi tương tự xuất hiện trong Pet AI | Các nút bấm trắc nghiệm hoạt động trơn tru, chấm điểm tức thì và báo đúng/sai kèm hiệu ứng chúc mừng. |
| **4. Tương thích API Key 2 lớp** | Kiểm tra với cả API Key cá nhân và API Key mặc định Vercel | Hoạt động mượt mà với cả hai nguồn API Key. |
| **5. Build & Lint** | Chạy `compile_applet` và kiểm tra TypeScript | Không có lỗi compile, không có lỗi giao diện. |

---

Bạn có thể nhấn nút **Proceed** để bắt đầu triển khai hoặc góp ý thêm bất kỳ điều chỉnh nào!
