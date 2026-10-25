# LE VAN TOAN — Photography Management

Ứng dụng quản lý lịch chụp sử dụng HTML/CSS/JavaScript thuần (không cần build), Cloudflare Workers API và D1.

## Chạy thử

Dùng một local HTTP server (ví dụ VS Code Live Server), hoặc tải thư mục lên Cloudflare Workers & Pages → Upload static files. Không mở `index.html` bằng `file://` vì module JS cần HTTP.

## Cấu hình

Trong `js/config.js`, sửa `API_BASE` nếu API chuyển tên miền. API hiện mặc định là `https://toanart-lichchup-api.toanluumy.workers.dev`.

Backend cần hỗ trợ CORS cho tên miền website mới: `Access-Control-Allow-Origin` theo allowlist, `Access-Control-Allow-Headers: Content-Type, Authorization`, `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`, và trả lời preflight OPTIONS. Không dùng `*` cho các cấu hình yêu cầu credentials. Phải kiểm tra xác thực và quyền ở Worker, không chỉ ẩn nút trên giao diện.

## Các endpoint được sử dụng

- POST `/api/auth/register` `{name,email,password}`
- POST `/api/auth/login` `{email,password}` → `{token}`
- GET `/api/me` → `{user}` hoặc đối tượng người dùng
- POST `/api/auth/logout`
- GET/POST `/api/customers`, PUT/DELETE `/api/customers/:id`
- GET/POST `/api/jobs`, PUT/DELETE `/api/jobs/:id`
- GET `/api/admin/users`, PATCH `/api/admin/users/:id/status`

Các trường job: `id,customer_id,customer_name,title,shoot_date,start_time,end_time,location,amount,deposit,status,payment_status,notes`. Phản hồi danh sách hỗ trợ `[]`, `{items:[]}`, `{jobs:[]}`, `{customers:[]}`, `{users:[]}`.

## Lưu ý quan trọng

- Đây là frontend chức năng, **chưa được kiểm thử trên Worker thật của bạn**. Nếu API trả field hoặc route khác, chỉnh trong `js/main.js`.
- Token lưu trong `sessionStorage` để giảm thời gian tồn tại nhưng vẫn có rủi ro XSS; nên chuyển sang phiên cookie HttpOnly Secure SameSite và thiết lập CSP, chống CSRF nếu dùng cookie.
- Không có âm lịch chính xác, push notification nền, upload ảnh hoặc đổi mật khẩu: cần backend riêng cho các tính năng này.
- Đổi mật khẩu đã lộ và thu hồi các token đã lộ trước khi vận hành thật. Không gửi token/mật khẩu qua ảnh chụp.
- Mọi dữ liệu khách hàng/công việc phải được Worker lọc bằng user_id đã xác thực; admin route phải kiểm tra quyền trên server.
