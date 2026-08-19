# Sovereign Prints Website

A complete website system with product catalogue, pricing management, and admin dashboard for Sovereign Prints.

## Features

### Customer Features
- ✅ Browse products by category
- ✅ View pricing tiers
- ✅ Submit quote requests
- ✅ Track quote status
- ✅ Responsive mobile design

### Admin Features
- ✅ Secure login
- ✅ Dashboard with quick stats
- ✅ Quote management (view, respond, track)
- ✅ Product management (add, edit, delete)
- ✅ Pricing management (update prices for each tier)
- ✅ All without touching code

## Technology Stack

- **Backend:** Node.js + Express
- **Database:** SQLite (simple, no setup needed)
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Hosting:** Ready for Render, Replit, Railway

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1: Clone or download the project

```bash
cd sovereign-prints
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up environment variables

Edit `.env` file:
```
PORT=3000
ADMIN_PASSWORD=admin123
```

**Important:** Change `admin123` to a strong password!

### Step 4: Start the server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

### Step 5: Access the website

- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Default Admin Password:** admin123 (change in .env)

## How to Use the Admin Dashboard

### Login
1. Go to http://localhost:3000/admin
2. Enter the admin password from `.env`
3. You're in!

### Dashboard Overview
The dashboard shows:
- **New Quotes Today** - Quotes submitted in the last 24 hours
- **Pending Quotes** - Quotes waiting for response
- **Total Products** - Active products in catalogue
- **Recent Quotes** - Last 5 quote requests

### Managing Quotes

1. Click "Quotes" in the sidebar
2. Filter by status: Pending, Responded, Won, Lost, All
3. Click "View" to see full quote details
4. Click "Respond" to update status and add notes
5. Quotes are automatically tracked and organized

### Managing Products

1. Click "Products" in the sidebar
2. View all active products in a table
3. **Add New:** Click "+ Add New Product"
4. **Edit:** Click "Edit" on any product
5. **Delete:** Click "Delete" (soft delete - won't lose history)

#### Add/Edit Product Fields:
- **Product Name** (required)
- **Category** - Choose from 6 categories
- **Base Price** (required) - Starting price in ZAR
- **Turnaround Days** - How long until delivery
- **Description** - What this product is for
- **Specifications** - Technical details (sizes, materials, etc.)
- **Active** - Toggle to hide/show product

### Managing Pricing

1. Click "Pricing" in the sidebar
2. Each product shows pricing tiers
3. Common tiers:
   - 1-10 units: 100% price
   - 11-50 units: 90% price (discount)
   - 51-100 units: 80% price
   - 101+ units: 70% price
4. **Click on any price to edit** - Changes save automatically

### Settings

1. Click "Settings" in the sidebar
2. Update business information:
   - Email address
   - Phone number
   - WhatsApp number
   - Physical address
3. **Change Admin Password:**
   - Enter new password
   - Confirm password
   - Click Save (password is updated in .env)

## Customer Journey

### For Standard Products
1. Customer visits homepage
2. Clicks "Browse Products"
3. Selects category
4. Clicks on product to see details and pricing
5. Submits a quote request OR contacts via WhatsApp

### For Custom Quotes
1. Customer visits homepage
2. Clicks "Get a Quote"
3. Fills in:
   - Name, email, phone
   - What service they need
   - Project description
   - Special requirements (design help, rush, etc.)
4. Submits form
5. Gets reference number (e.g., QT-1692123456789)
6. **You see it in admin dashboard within seconds**
7. Review, add notes, mark status
8. Customer can check status anytime

## Database

### What's Stored
- **Products** - All products with descriptions, prices, specs
- **Quotes** - All customer quote requests and status
- **Pricing Tiers** - Price breakpoints for each product
- **Admin Users** - Login credentials (expandable)

### Where It's Stored
- Automatically created in-memory on startup
- Data persists while server is running
- **Important:** Data resets when server restarts

### For Production (Optional)
To keep data permanently:
1. Change `sqlite3.Database(':memory:', ...)` to `sqlite3.Database('sovereignprints.db', ...)`
2. Database file `sovereignprints.db` will be created and persisted

## Deploying to Render

### Step 1: Create Render account
https://render.com

### Step 2: Connect GitHub
Push your project to GitHub

### Step 3: Create New Web Service
- Select your GitHub repo
- Set Start Command: `npm start`
- Set Environment Variables:
  - `PORT` = auto (Render sets this)
  - `ADMIN_PASSWORD` = your strong password
  - `NODE_ENV` = production

### Step 4: Deploy
Click "Deploy" and wait ~2 minutes

Your site will be live at: `https://your-project-name.onrender.com`

## Adding Your Business Info

Edit these files to customize:

### Homepage Content
- **File:** `public/index.html`
- Change business name, tagline, descriptions

### Contact Information
- **File:** `public/index.html` and other pages
- Update phone, email, address in footer

### WhatsApp Link
- **File:** `public/index.html`, `public/quote.html`
- Replace phone number in: `https://wa.me/27123456789`

## Email Notifications (Future)

Currently, quotes are stored but no email is sent. To add email:

1. Install nodemailer: `npm install nodemailer`
2. Add to `server.js`:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```
3. Send email when quote submitted
4. Email you when new quote arrives

## Backup Your Data

Since data is in-memory by default:

1. **Change to file-based database:**
   - Edit `server.js`
   - Change `':memory:'` to `'sovereignprints.db'`
   - Redeploy

2. **Or regularly export quotes:**
   - Download quotes from admin dashboard
   - Save as backup

## Troubleshooting

### Admin login not working
- Check password in `.env`
- Clear browser cookies/cache
- Try incognito window

### Products not showing
- Check server is running: `npm start`
- Refresh page
- Check browser console for errors (F12)

### Quotes not appearing
- Wait a moment after submission
- Refresh admin dashboard
- Check if browser is blocking JavaScript

### Server won't start
- Delete `node_modules` folder
- Run `npm install` again
- Check if port 3000 is already in use

## File Structure

```
sovereign-prints/
├── server.js                 # Backend server
├── package.json              # Dependencies
├── .env                      # Configuration
├── public/
│   ├── index.html            # Homepage
│   ├── products.html         # Products catalogue
│   ├── gallery.html          # Gallery page
│   ├── quote.html            # Quote request form
│   ├── admin.html            # Admin dashboard
│   ├── styles.css            # Global styling
│   ├── admin.css             # Admin styling
│   ├── app.js                # Main JS
│   ├── products.js           # Products page JS
│   ├── quote.js              # Quote form JS
│   └── admin.js              # Admin JS
└── uploads/                  # Uploaded images (auto-created)
```

## API Endpoints

### Customer Endpoints
- `GET /api/products` - List all products
- `GET /api/products/:id` - Product details
- `GET /api/categories` - List categories
- `POST /api/quotes` - Submit quote request
- `GET /api/quotes/:referenceNumber` - Check quote status

### Admin Endpoints (require authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/quotes` - List all quotes
- `GET /api/admin/quotes/:id` - Quote details
- `PATCH /api/admin/quotes/:id` - Update quote
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/pricing` - Add pricing tier
- `PATCH /api/admin/pricing/:tierId` - Update price

## Support & Customization

### Common Changes

**Change colors:**
- Edit `public/styles.css`
- Look for `:root { --primary: #6366f1; }` section
- Update color codes

**Add social media:**
- Edit `public/index.html`
- Add links in footer

**Change product categories:**
- Edit `server.js`
- Update category list in form
- Add new categories to database

**Change admin password:**
- Via admin dashboard Settings tab, OR
- Edit `.env` file

## Notes for Owner (Cathrine)

1. **Your admin password should be STRONG** - change from "admin123"
2. **Backup your data** - The database currently resets if server restarts. Consider deploying with persistent database.
3. **Mobile-friendly** - Test the site on your phone to see how customers experience it
4. **WhatsApp link** - Update your WhatsApp number in the footer and quote page
5. **Email** - If you want quote notifications, let me know and I can add email integration
6. **Custom branding** - Edit colors, logo, business name in the HTML/CSS files
7. **Keep admin password safe** - Never share it publicly

## Next Steps

1. Deploy to Render (instructions above)
2. Test with friends
3. Update business info
4. Add your products
5. Set pricing for each tier
6. Go live!

---

Built for Sovereign Prints | August 2026
