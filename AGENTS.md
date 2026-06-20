# AGENTS.md — Production Agent Rules

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# 1. REQUIRED FIRST ACTION

Before making ANY change:

1. Read `/plan.md`
2. Read `/CLAUDE.md`
3. Inspect existing codebase
4. Compare implementation vs `plan.md`
5. Identify gaps or violations
6. Create execution plan
7. Only then write code

Never skip this step.

---

# 2. SOURCE OF TRUTH PRIORITY

If there is a conflict:

1. `plan.md` (HIGHEST PRIORITY — business rules)
2. `AGENTS.md` (execution rules)
3. `CLAUDE.md` (architecture/style guide)
4. Existing code (LOWEST PRIORITY)

If code conflicts with `plan.md` → OVERRIDE CODE.

---

# 3. NEXT.JS SAFETY RULE

This project may use a Next.js version that differs from training data.

Before modifying:

* App Router
* Server Actions
* Route Handlers
* Middleware
* Metadata
* Caching
* Auth flow
* Build config

You MUST check:

node_modules/next/dist/docs/

Do NOT assume old Next.js behavior.

---

# 4. PRODUCTION-FIRST RULE

This project is production-oriented.

Prioritize:

* Security
* Data integrity
* Payment correctness
* Authentication safety
* Server-side validation

NEVER prioritize:

* Demo UX shortcuts
* Fake flows
* Client-only logic
* Mock data

---

# 5. ECOMMERCE ARCHITECTURE RULES

## Required Stack

* Supabase Auth (ONLY auth system)
* Supabase Database (ONLY database)
* VNPay (ONLY payment gateway)
* Resend (ONLY email provider)

## Single Source of Truth

* Products → Supabase
* Orders → Supabase
* Users → Supabase Auth

---

## Forbidden Patterns

NEVER introduce:

* Hardcoded users
* Demo login systems
* localStorage as persistence layer
* Zustand as source of truth for orders/auth
* JSON product fallback
* Mock payment success states
* Fake checkout providers
* Client-only admin checks

---

# 6. ADMIN SYSTEM RULE

Admin access MUST be server-validated.

## Rule

User is admin ONLY if:

* Supabase Auth user exists
* AND profile.role === "admin"

## Admin access

* `/admin` route must be protected server-side
* API routes must validate role server-side
* Middleware must enforce authentication

NO client-side-only protection is allowed.

---

# 7. VNPay PAYMENT RULE

Payment flow must be:

1. Create order (pending)
2. Redirect to VNPay
3. VNPay IPN callback (TRUSTED SOURCE)
4. Verify signature server-side
5. Mark order as PAID
6. Deduct inventory
7. Send email confirmation

IMPORTANT:

* NEVER trust return URL
* ONLY trust IPN webhook

---

# 8. ORDER SYSTEM RULE

Orders must be:

* Stored in Supabase ONLY
* Created server-side
* Updated via verified payment webhook

Each order must include:

* user_id
* order_items snapshot
* total amount
* payment_status
* order status

---

# 9. INVENTORY RULE

Inventory must be:

* checked BEFORE payment creation
* deducted AFTER VNPay IPN success
* handled server-side only

Never trust client quantity.

---

# 10. EMAIL RULE

Use Resend only.

Send emails for:

* Order confirmation (customer)
* New order alert (admin)

Trigger only after payment = PAID.

---

# 11. SECURITY RULES

NEVER commit:

* API keys
* Supabase service role keys
* VNPay secret keys
* Resend API keys
* Passwords

Use `.env` ONLY.

---

# 12. QUALITY GATES

Before completing any task:

* Ensure no mock data remains
* Ensure no localStorage persistence for business logic
* Ensure server-side validation exists
* Ensure Supabase is single source of truth
* Ensure payment flow is real (VNPay + IPN)
* Run build successfully

---

# 13. DEFINITION OF DONE

A feature is complete ONLY if:

User can:

* View products from Supabase
* Register / login via Supabase Auth
* Checkout product
* Pay via VNPay
* Receive email confirmation
* View order history from database

Admin can:

* Login via Supabase
* Access `/admin` securely
* View all orders
* Update order status

---

# 14. FAILURE CONDITIONS

The following are considered INVALID implementation:

* Fake payment success
* Demo authentication
* localStorage-based orders
* Client-only admin checks
* Missing webhook validation
* JSON-based product catalog

---

END OF AGENTS RULES
