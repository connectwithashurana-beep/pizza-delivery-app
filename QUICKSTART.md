# 🍕 Pizza Delivery App - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites:
- ✅ Python 3.9+
- ✅ Node.js 16+
- ✅ MySQL 8.0 running
- ✅ Redis running (for WebSockets)

---

## 1️⃣ Start Backend Server

```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
August 14, 2026 - 16:47:40
Django version 5.0.6, using settings 'core.settings'
Starting development server at http://127.0.0.1:8000/
```

✅ Backend ready at: **http://127.0.0.1:8000/api/**

---

## 2️⃣ Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://127.0.0.1:5173/
  ➜  Press h to show help
```

✅ Frontend ready at: **http://127.0.0.1:5173/**

---

## 3️⃣ Test the Complete Customer Journey

### In Your Browser:

1. **Open Homepage**: http://127.0.0.1:5173/
   - Should see hero section with "Order Now" button
   - See 3 featured pizzas
   - See testimonials section

2. **Browse Menu**: Click "Browse Menu"
   - Should see 22 pizzas in grid
   - Try searching "paneer" (should filter)
   - Click pizza card → see details

3. **Create Custom Pizza** (Optional):
   - Find "Build Your Own" button
   - Select base, sauce, cheese, toppings
   - Click "Add to Cart"

4. **Add to Cart**: 
   - Click any pizza card
   - Click "Add to Cart" button
   - See cart count increase

5. **View Cart**: Click shopping cart icon
   - Should see items with quantities
   - See total = subtotal + 5% GST + ₹40 delivery

6. **Register** (if needed):
   - Click "Register" in navbar
   - Fill form: username, email, phone, password
   - Click "Sign Up"

7. **Login**:
   - Click "Login" in navbar
   - Email: `customer@pizzahub.local`
   - Password: `customer123`
   - Should be redirected to dashboard

8. **Checkout**:
   - Go to Cart
   - Click "Checkout"
   - Fill delivery address: "123 Main Street, City"
   - Fill phone: "9876543211"
   - Click "Place Order"

9. **See Order Confirmation**:
   - Should be redirected to Payment page
   - (Payment will fail without Razorpay credentials - expected)
   - Or go to "Orders" page

10. **View Order Status**:
    - Click "Orders" in navbar
    - Should see your order
    - Click order → see status with tracker
    - Status should be "received"

11. **Admin View** (Optional):
    - Go to http://127.0.0.1:5173/admin/login
    - Email: `admin@pizzahub.local`
    - Password: `admin123`
    - See Admin Dashboard with 6 KPI cards
    - See the order you just created

---

## 🧪 Run Automated Tests

```bash
cd (project root)
python test_journey.py
```

**Expected Output:**
```
TEST 1: Browse Menu ................................. ✅ PASSED
TEST 2: Customer Login .............................. ✅ PASSED
TEST 3: Create Order ................................ ✅ PASSED
TEST 4: Payment Order Creation ..................... ⚠️ FAILED (needs Razorpay key)
TEST 5: Admin Login ................................. ✅ PASSED
TEST 6: Fetch Order (Customer View) ............... ✅ PASSED
TEST 7: Admin Updates Order Status ................ ✅ PASSED
TEST 8: Customer Sees Updated Status .............. ✅ PASSED
TEST 9: Admin Dashboard ............................ ✅ PASSED

Result: 8/9 features verified working ✅
```

---

## 💳 Enable Payments (Optional)

To enable Razorpay payments:

1. **Get Razorpay Test Credentials**:
   - Sign up at https://razorpay.com (test account)
   - Go to Settings → API Keys
   - Copy `Key ID` and `Key Secret`

2. **Update Backend** (`backend/.env`):
   ```
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
   ```

3. **Update Frontend** (`frontend/.env`):
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   ```

4. **Restart Backend**:
   - Stop the server (CTRL+BREAK)
   - Run `python manage.py runserver 127.0.0.1:8000` again

5. **Test Payment**:
   - Repeat checkout steps above
   - On payment page, Razorpay modal should open
   - Use test card: `4111 1111 1111 1111`
   - Any future date, any CVV

---

## 📧 Enable Email Notifications (Optional)

To enable order confirmation & status update emails:

1. **Using Gmail**:
   - Enable "Less secure app access" or use "App Passwords"
   - Get your app-specific password

2. **Update Backend** (`backend/.env`):
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=your.email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password_here
   ADMIN_EMAIL=your.email@gmail.com
   ```

3. **Restart Backend**

4. **Test Email**:
   - Create an order
   - Should receive confirmation email at your address

---

## 🗄️ Database Info

### Test User Credentials:

**Customer Account:**
- Email: `customer@pizzahub.local`
- Password: `customer123`

**Admin Account:**
- Email: `admin@pizzahub.local`
- Password: `admin123`

### Database Details:
- Host: `127.0.0.1`
- Port: `3306`
- Database: `pizza_app`
- Username: `root`
- Password: `ashu`

### Reset Database:
```bash
cd backend
python manage.py flush  # Clears all data
python manage.py migrate  # Re-runs migrations
python manage.py seed_data  # Seeds with pizzas
python create_test_users.py  # Creates test users
```

---

## 🔧 Troubleshooting

### "Connection refused on port 8000"
→ Backend server not running. Run: `python manage.py runserver 127.0.0.1:8000`

### "Cannot connect to MySQL"
→ MySQL not running. Start MySQL service (Windows: `net start MySQL80` or similar)

### "ModuleNotFoundError: No module named 'rest_framework'"
→ Dependencies not installed. Run: `pip install -r requirements.txt`

### "Module not found: 'axios'" (Frontend)
→ npm modules not installed. Run: `npm install` in frontend folder

### "WebSocket connection failed"
→ Redis not running. Start Redis service (usually `redis-server` or similar)

### "Razorpay payment fails with 502 error"
→ Razorpay credentials not configured (expected). Use test keys from Razorpay account.

### "Email not sending"
→ SMTP credentials not configured. Set up Gmail/SendGrid/other in `.env`

---

## 📊 API Endpoints Reference

### Public Endpoints (No Auth):
- `GET /api/inventory/pizzas/` - Browse all pizzas
- `GET /api/inventory/bases/` - Get pizza bases
- `POST /api/auth/register/` - Register new customer
- `POST /api/auth/login/` - Customer login
- `POST /api/auth/admin-login/` - Admin login

### Protected Endpoints (Require JWT Token):
- `POST /api/orders/` - Create new order
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/{id}/update_status/` - Admin: update status
- `GET /api/dashboard/summary/` - Admin: dashboard KPIs
- `POST /api/payments/create-order/` - Create Razorpay order
- `POST /api/payments/verify/` - Verify Razorpay payment

### WebSocket Endpoints:
- `ws://localhost:8000/ws/orders/{order_id}/?token=ACCESS_TOKEN` - Real-time order tracking

---

## ✅ Verification Checklist

- [ ] Backend server running on http://127.0.0.1:8000
- [ ] Frontend server running on http://127.0.0.1:5173
- [ ] Can browse menu without login
- [ ] Can login with customer@pizzahub.local / customer123
- [ ] Can add pizza to cart
- [ ] Can checkout and place order
- [ ] Can login as admin with admin@pizzahub.local / admin123
- [ ] Admin dashboard shows order count
- [ ] Can update order status as admin
- [ ] Customer sees updated status

If all checked ✅ → **Application is ready for use!**

---

## 📚 Additional Resources

- **Full Report**: See `COMPLETION_REPORT.md`
- **Architecture Diagram**: See `architecture.md` (if available)
- **API Documentation**: See `backend/api_docs.md` (if available)
- **Installation Guide**: See `SETUP.md` (if available)

---

**Happy Testing! 🎉**
