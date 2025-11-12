# .github/agents

Thư mục này chứa các định nghĩa agent (YAML) phục vụ tự động hóa và trợ lý AI cho repo Arkham City.

## Mục đích
- Chuẩn hóa cấu hình cho Copilot/LLM agent (model, quyền truy cập, intent, triggers).
- Dễ dàng thay thế / nâng cấp mô hình mà không ảnh hưởng logic ứng dụng cốt lõi.

## Định dạng file YAML
Các trường chính:
- `version`: phiên bản schema.
- `kind`: loại thực thể (agent).
- `name`: định danh agent.
- `model`: nhà cung cấp, tên model, khả năng.
- `context`: nguồn dữ liệu nạp vào (ingestion, exclude, dynamic queries).
- `permissions`: phạm vi quyền (filesystem, network, actions).
- `policies`: thông số an toàn (safety, rate limit, guardrails).
- `intents`: tập các mục tiêu tác vụ mô tả bởi người dùng.
- `triggers`: điều kiện kích hoạt (manual command, events).
- `functions`: các hàm mà agent có thể gọi (function calling interface).
- `workflow`: pipeline xử lý chuẩn.
- `telemetry`: metric thu thập.

## Thêm Agent Mới
1. Tạo file `tên-agent.yml` trong thư mục này.
2. Khai báo `model` và `permissions` phù hợp.
3. Commit + mở PR để review bảo mật.

## Bảo mật
- Hạn chế ghi file ngoài vùng được phép.
- Dùng guardrails để chặn rò rỉ secrets.

## Hiện có
- `gpt5.yml`: Copilot Agent GPT-5 (mô hình giả định, có thể thay thế bằng model thật).

---
Cập nhật thêm schema khi có nhu cầu mở rộng.
