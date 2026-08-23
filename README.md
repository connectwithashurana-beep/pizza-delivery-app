# 🍕 Pizza Delivery Full Stack Application

A full stack pizza delivery platform: Django + DRF + MySQL backend with JWT auth, Razorpay
payments, real-time order tracking via Django Channels, and Celery-powered low-stock email
alerts — paired with a React (Vite) + Tailwind CSS frontend.

## Project Overview

- **Customers** can register/verify email, browse the menu, build a custom pizza (base → sauce →
  cheese → vegetables), manage a cart, checkout, pay via Razorpay (test mode), and track their
  order status live over WebSockets.
- **Admins** get a separate login, a dashboard with revenue/order KPIs and low-stock alerts, full
  CRUD over inventory (bases, sauces, cheeses, vegetables), order management (status updates,
  cancellation), and an analytics view (revenue chart, best sellers, top customers).

## Folder Structure

```
pizza-delivery-app/
├── backend/
│   ├── core/            # settings, urls, asgi/wsgi, celery config
│   ├── accounts/        # custom User model, JWT auth, email verification, password reset
│   ├── inventory/       # Pizza, PizzaBase, Sauce, Cheese, Vegetable + admin CRUD APIs
│   ├── orders/          # Order, OrderItem, Channels consumer for live status
│   ├── payments/        # Razorpay order creation + signature verification
│   ├── notifications/   # in-app notifications
│   ├── dashboard/       # admin summary + analytics endpoints
│   ├── media/           # uploaded pizza images
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, PizzaCard, ProtectedRoute, Spinner
│   │   ├── context/     # AuthContext, CartContext
│   │   ├── layouts/     # MainLayout, AdminLayout
│   │   ├── pages/        # all customer + admin pages
│   │   ├── services/    # axios instance with JWT refresh
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database.sql
├── .env.example
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8+
- Redis 6+ (for Channels + Celery)

## 1. MySQL Setup

```sql
-- run database.sql, or manually:
CREATE DATABASE pizza_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp ../.env.example .env         # then edit values (DB, email, Razorpay, Redis)

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # creates a Django admin; set role='superadmin' via /admin

python manage.py runserver
```

To run the ASGI server (needed for WebSockets), use Daphne instead:

```bash
daphne -p 8000 core.asgi:application
```

### Environment Variables (backend, from `.env`)

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key |
| `DEBUG` | `True`/`False` |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | MySQL connection |
| `CORS_ORIGINS` | Comma separated allowed frontend origins |
| `FRONTEND_URL` | Used to build email verification / reset links |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `ADMIN_EMAIL` | SMTP settings |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay test mode keys |
| `REDIS_URL` | Redis connection string |
| `GST_PERCENT`, `DELIVERY_CHARGE` | Order pricing config |

### Redis Setup

Install and run Redis locally (`redis-server`), or use Docker:

```bash
docker run -p 6379:6379 redis:7
```

### Celery Setup

In separate terminals (with the venv activated):

```bash
celery -A core worker -l info
celery -A core beat -l info
```

This powers the hourly low-stock check that emails `ADMIN_EMAIL` when any ingredient falls
below its configured threshold (see `LOW_STOCK_THRESHOLDS` in `settings.py`).

### SMTP Setup

Use any SMTP provider (Gmail App Password, SendGrid, Mailgun, etc.) and fill in
`EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` in `.env`. For Gmail, enable 2FA and
generate an "App Password" — do not use your normal password.

### Razorpay Setup

1. Create a free account at https://razorpay.com and switch to **Test Mode**.
2. Copy the Test **Key ID** and **Key Secret** from Settings → API Keys.
3. Put them in both `backend/.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) and
   `frontend/.env` (`VITE_RAZORPAY_KEY_ID`).
4. Use Razorpay's test card `4111 1111 1111 1111`, any future expiry, any CVV, to simulate payment.

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # edit VITE_API_BASE_URL / VITE_WS_BASE_URL / VITE_RAZORPAY_KEY_ID if needed
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.

## Creating an Admin Account

Admins cannot self-register from the frontend. Create one via Django shell or admin panel:

```bash
python manage.py shell
```
```python
from accounts.models import User
u = User.objects.create_user(username="admin1", email="admin@example.com", password="StrongPass123", role="admin")
u.is_email_verified = True
u.is_staff = True
u.save()
```

Only a `superadmin` (created similarly, with `role="superadmin"`) should create further admins.

## API Documentation (high level)

All endpoints are prefixed with `/api/`.

- `POST /auth/register/`, `POST /auth/login/`, `POST /auth/admin-login/`, `POST /auth/logout/`
- `POST /auth/verify-email/<uuid:token>/`
- `POST /auth/forgot-password/`, `POST /auth/reset-password/`
- `GET/PATCH /auth/profile/`, `POST /auth/change-password/`
- `POST /auth/token/refresh/`
- `GET/POST/PATCH/DELETE /inventory/pizzas/`, `/inventory/bases/`, `/inventory/sauces/`,
  `/inventory/cheeses/`, `/inventory/vegetables/` (supports `?search=`, `?ordering=`, filters)
- `GET/POST /orders/`, `POST /orders/<id>/update_status/`, `POST /orders/<id>/cancel/`
- `POST /payments/create-order/`, `POST /payments/verify/`
- `GET /notifications/`
- `GET /dashboard/summary/`, `GET /dashboard/analytics/` (admin only)
- WebSocket: `ws://<host>/ws/orders/<order_id>/` — live order status push

## Deployment Steps (outline)

1. Set `DEBUG=False`, configure real `ALLOWED_HOSTS`, `CORS_ORIGINS`, `CSRF_TRUSTED_ORIGINS`.
2. Use a managed MySQL instance and a managed Redis instance (or provision your own).
3. Serve Django via Daphne/Uvicorn behind Nginx for both HTTP and WebSocket traffic.
4. Run Celery worker + beat as separate long-running services (systemd/Supervisor/Docker).
5. Build the frontend (`npm run build`) and serve the static `dist/` via Nginx or a CDN.
6. Switch Razorpay to Live Mode keys once ready for production payments.
7. Set up HTTPS (Let's Encrypt) — required for Razorpay live mode and secure cookies.

### Render + Vercel configuration

`render.yaml` defines the Django web service and Celery worker. In Render, enter the
same values for the `sync: false` variables on both services where applicable:

- `DJANGO_SECRET_KEY`: generate a new long random value; never reuse the local key.
- `ALLOWED_HOSTS`: the exact Render hostname, for example `pizzahub-api.onrender.com`.
- `CORS_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `FRONTEND_URL`: the exact Vercel origin,
  including `https://` and no trailing slash.
- `DB_*`: credentials for a managed MySQL-compatible database reachable from Render.
- `REDIS_URL`: a managed Redis connection string, including TLS settings if supplied.
- `EMAIL_HOST_USER`: the Gmail address used for sending mail.
- `EMAIL_HOST_PASSWORD`: the 16-character Gmail App Password, not the normal Gmail password.
- `DEFAULT_FROM_EMAIL` and `ADMIN_EMAIL`: verified sender and alert recipient addresses.
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Razorpay **Test Mode** values initially.

For Vercel, set these variables under **Project Settings → Environment Variables** for
the Production environment, then redeploy:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://<render-host>.onrender.com/api` |
| `VITE_WS_BASE_URL` | `wss://<render-host>.onrender.com/ws` |
| `VITE_RAZORPAY_KEY_ID` | The Razorpay Test Key ID (public value only) |

Set the Vercel project root directory to `frontend`. The `frontend/vercel.json` SPA
rewrite keeps client-side routes such as `/orders/1` working after refresh. Verify the
backend first at `https://<render-host>.onrender.com/health/`, then deploy the frontend.

## Notes on Scope

This is a complete, runnable core implementation of every feature area requested (auth, pizza
builder, cart/checkout, Razorpay payments, live order tracking, admin inventory/orders/analytics,
low-stock email alerts). For a production launch you'd additionally want: automated tests, rate
limiting tuned to real traffic, image optimization/CDN, invoice PDF generation, and a CI/CD
pipeline — none of which change the architecture already in place here.
