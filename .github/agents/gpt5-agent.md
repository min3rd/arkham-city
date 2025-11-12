---
name: arkham-city-gpt5-agent
model: gpt5
language: vi
description: |
  Agent hỗ trợ phát triển và thay đổi cho repository "arkham-city" (kiến trúc NestJS microservice + RabbitMQ + Angular).
  Sử dụng model `gpt5`. Khi thực hiện thay đổi mã nguồn, agent phải tuân thủ chặt chẽ các instruction nội bộ của dự án (xem phần "Project instructions" bên dưới) — những quy tắc này là bắt buộc.

project_instructions: |
  Nội dung sau đây là các quy tắc bắt buộc. Agent phải tuân thủ mọi lúc khi tạo hoặc sửa mã:

  - Kiến trúc: tuân thủ mô hình microservice; dùng RabbitMQ làm message broker giữa các service.
  - NestJS: module hóa rõ ràng; validation (class-validator), guard JWT; không hard-code secrets.
  - Angular: sử dụng cú pháp mới nhất; ưu tiên standalone components; dùng signals cho state; lazy-loading routes; modern control flow (`@if`, `@for`, `@switch`).
  - Không sử dụng `console.log`/`console.error`/`debugger` hoặc tương đương để debug.
  - Không để bình luận trong mã nguồn; mọi giải thích đặt trong tài liệu (`README`, `docs/`) hoặc commit message.
  - Localization: dùng Transloco (nếu áp dụng trong dashboard); tránh hard-code UI strings trong template.
  - HTML templates: mỗi phần tử được thêm mới nên có `id` duy nhất nếu có tương tác/track; tránh id trùng lặp.
  - State management: dùng `signals`; không `mutate`; dùng `set`/`update` chuẩn.
  - Services: single responsibility; `providedIn: 'root'`; ưu tiên `inject()` thay constructor injection.
  - Styling: theo quy ước dự án hiện có; nếu dùng Tailwind, không thêm framework khác khi không cần thiết.

usage: |
  - Mục tiêu: giúp contributor thực hiện các thay đổi mã nguồn, sửa lỗi, thêm tính năng, viết tests và tài liệu cho repository "arkham-city" theo các quy tắc trên.
  - Khi được yêu cầu sửa file: trả về chính xác các thay đổi ở dạng patch (nếu được phép) hoặc hướng dẫn từng bước kèm lệnh để thực hiện. Nếu có quyền sửa trực tiếp, đảm bảo dùng công cụ sửa file phù hợp.
  - Luôn kiểm tra lint / build / tests nếu có thể sau thay đổi; nếu không thể chạy, nêu rõ lý do.

behavior_constraints: |
  - Luôn tuân thủ project_instructions. Nếu đề xuất vi phạm bất kỳ quy tắc nào, hãy tự điều chỉnh và nêu ngắn gọn lý do.
  - Không thêm thư viện mới mà không cập nhật manifest (ví dụ `package.json`) và không có giải thích hợp lý.
  - Không tạo/giữ comments trong mã nguồn; nếu cần giải thích, cập nhật tài liệu trong `docs/` hoặc `README.md`.

security_and_privacy: |
  - Không xuất dữ liệu nhạy cảm, không exfiltrate secrets.
  - Khi xử lý tệp cấu hình hoặc environment, báo rõ biến môi trường cần thiết; không in giá trị thực tế của secrets.

notes: |
  - File này dành cho repo `arkham-city` và phù hợp với các quy tắc trước đó trong `.github/agents/gpt5.yml` và `gpt5.md`.
  - Nếu cần thay đổi quy tắc project_instructions, cập nhật tập trung trong `.github/agents/gpt5-agent.md` và ghi lại trong `docs/agents.md`.
---

# Quick reference (tóm tắt cho contributors)

- Model: `gpt5`
- Kết luận chính: mọi code change phải tuân thủ kiến trúc microservice NestJS + RabbitMQ, Angular cú pháp mới; không `console.log`; không comment trong code.
