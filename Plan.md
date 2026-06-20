# Production Scope (VNPay + Supabase)

## Mục tiêu

Xây dựng hệ thống ecommerce production-first.

Ưu tiên:

1. Khách hàng xem sản phẩm
2. Đặt hàng
3. Thanh toán VNPay
4. Nhận email xác nhận
5. Xem lịch sử đơn hàng trong tài khoản

Không ưu tiên:

* CMS phức tạp
* Product CRUD nâng cao
* Category CRUD
* Brand CRUD
* Variant editor

Dữ liệu sản phẩm sẽ được quản lý trực tiếp trong Supabase.

---

# Authentication

## Supabase Auth

Sử dụng:

* Email + Password
* Session Supabase
* SSR session

Bỏ hoàn toàn:

```txt
src/store/auth.ts
DEMO_USERS
localStorage auth
zustand auth
```

---

# Admin

## Tài khoản admin duy nhất

Email:

```txt
boospace7
```

Password:

```txt
Boospace7
```

Lưu trong Supabase Auth.

Sau khi đăng nhập:

```txt
profiles.role = 'admin'
```

## Bảng profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  email text,
  role text default 'customer',
  created_at timestamptz default now()
);
```

## Rule

Nếu:

```txt
role = admin
```

hiển thị:

```txt
/admin
```

Nếu:

```txt
role != admin
```

thì:

* chặn toàn bộ /admin
* redirect về /

Middleware phải check server-side.

Không dùng check client-side.

---

# Product Source

## Single Source Of Truth

Chỉ dùng:

```txt
Supabase
```

Xóa:

```txt
products.json
fallback json
mock catalog
```

Search phải query database.

Storefront phải query database.

---

# Product Table

```sql
products
```

Tối thiểu:

```sql
id
slug
name
description
price
sale_price
inventory
images
category
brand
is_active
created_at
updated_at
```

Không cần CMS nâng cao.

---

# Checkout Flow

## Luồng chuẩn

Customer

↓

Checkout

↓

Create Pending Order

↓

VNPay

↓

Return URL

↓

Verify Signature

↓

Update Order

↓

Payment Success

↓

Send Email

↓

Order Visible In Account

---

# Orders Table

```sql
orders
```

Fields:

```sql
id
user_id
email
phone
customer_name

subtotal
shipping_fee
total

status
payment_status

vnp_txn_ref
vnp_transaction_no

created_at
updated_at
```

Status:

```txt
pending
paid
processing
completed
cancelled
```

Payment:

```txt
pending
paid
failed
```

---

# Order Items

```sql
order_items
```

Fields:

```sql
order_id
product_id
product_name
price
quantity
```

Snapshot dữ liệu tại thời điểm mua.

---

# Inventory

Khi VNPay callback thành công:

```txt
inventory = inventory - quantity
```

Kiểm tra inventory server-side trước khi tạo payment.

Không trust dữ liệu từ client.

---

# VNPay Integration

## Required

Environment:

```env
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=
VNPAY_RETURN_URL=
```

### API

```txt
/api/payment/vnpay/create
```

Tạo URL thanh toán.

### API

```txt
/api/payment/vnpay/return
```

Verify chữ ký VNPay.

### API

```txt
/api/payment/vnpay/ipn
```

Xử lý callback server-side.

IPN là nguồn dữ liệu chính.

Không trust return URL.

---

# Email

Sử dụng Resend.

## Event

Sau khi payment_status = paid

Gửi:

### Customer

Order confirmation

### Admin

New order notification

---

# Account

## Orders Page

```txt
/account/orders
```

Load từ database.

Không dùng:

```txt
localStorage
zustand
```

Hiển thị:

* mã đơn
* trạng thái
* tổng tiền
* thời gian
* chi tiết đơn

---

# Security

## Supabase RLS

Customer:

```txt
chỉ xem đơn của chính mình
```

Admin:

```txt
xem toàn bộ đơn
```

---

# Remove

Xóa hoàn toàn:

* demo checkout
* fake payment
* DEMO_USERS
* localStorage orders
* Zustand order persistence
* JSON catalog fallback
* mock success page data

---

# Production Priority

P0

1. Supabase Auth
2. Profiles + Role
3. Middleware Admin
4. VNPay
5. Orders
6. Order Items
7. Inventory Deduction
8. Resend Email
9. Account Orders

P1

1. Admin Order Detail
2. Update Order Status
3. Dashboard Statistics

P2

1. Analytics
2. Reviews
3. Coupons
4. Wishlist Sync
5. Multi-language

---

# Definition Of Done

Người dùng có thể:

* Đăng ký
* Đăng nhập
* Xem sản phẩm
* Checkout
* Thanh toán VNPay
* Nhận email xác nhận
* Xem lịch sử đơn hàng

Admin có thể:

* Đăng nhập bằng tài khoản admin
* Truy cập /admin
* Xem đơn hàng
* Cập nhật trạng thái đơn

Các tài khoản không phải admin:

* Không thể truy cập /admin
* Không thể gọi API admin
* Không thể thực thi server actions admin
