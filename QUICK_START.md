# Sovereign Prints - Quick Start Guide for Owner

## What You've Got

A complete website with:
1. **Customer website** - Product catalogue, pricing, quote form
2. **Admin dashboard** - Manage everything without touching code
3. **Database** - All quotes and products stored securely
4. **Mobile-friendly** - Works perfectly on phone, tablet, desktop

## Running It Locally (Your Computer)

### First Time Setup (5 minutes)

1. Open Terminal/Command Prompt
2. Navigate to the project folder:
   ```
   cd sovereign-prints
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser:
   - Website: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Password: `admin123`

### Every Time You Want to Use It

```
npm start
```

Then visit http://localhost:3000

## Admin Dashboard - Your Control Center

### Where to Find Things

**DASHBOARD (Home):** See today's stats at a glance
- New quotes today
- Pending quotes waiting for response
- Total products in catalogue

**QUOTES:** Manage all customer quote requests
- See who's asking for quotes
- Click "View" to read their full request
- Click "Respond" to mark as responded
- Filter by: Pending, Responded, Won, Lost

**PRODUCTS:** Manage your product catalogue
- Add new products (click "+ Add New Product")
- Edit existing products
- Delete products you don't offer anymore
- Set turnaround times, descriptions, specs

**PRICING:** Update prices without coding
- Each product shows all quantity tiers
- Click a price to edit it
- Changes save instantly
- Customers see updated prices immediately

**SETTINGS:** Your business info
- Business email, phone, WhatsApp
- Physical address
- Change admin password (keep it SECRET!)

## What Customers See

### Homepage
- Clear explanation of what you do
- Browse products button
- Request a quote button
- Recent work (gallery)

### Products Page
- Filter by category
- See pricing for each product
- Click to see full details and pricing tiers

### Quote Page
- Simple form to submit custom requests
- Gets unique reference number (QT-123456789)
- Notification shows confirmation
- They can track status if needed

## Three Key Features You'll Love

### 1. Easy Product Management
No coding needed!
- Add product → Set name, price, category → Done
- Update price → Click field → Type new price → Saved
- Delete product → Click delete button → Gone

### 2. Quote Tracking
All quotes in one place:
- Customers submit → You see instantly in dashboard
- Respond to quote → Status changes automatically
- Customer email shows in list for quick contact

### 3. Zero Code Changes
Everything editable in admin:
- Add products
- Change prices
- Update business info
- Set which products are active/inactive

## Common Tasks

### Add a New Product

1. Go to Admin → Products
2. Click "+ Add New Product"
3. Fill in:
   - Product Name: "Business Cards"
   - Category: "Printing"
   - Base Price: "350" (in ZAR)
   - Description: "Professional business cards"
   - Specifications: "250 units, 300gsm cardstock"
   - Turnaround Days: "3"
4. Click "Save Product"
5. New product appears instantly on website!

### Update a Price

1. Go to Admin → Pricing
2. Find your product
3. See the quantity tiers (1-10, 11-50, 51-100, 100+)
4. Click on a price to change it
5. Price updates immediately on website

### View a Quote Request

1. Dashboard shows "Recent Quote Requests"
2. Click "View" to see full details
3. See their:
   - Name, email, phone
   - What they're asking for
   - When they submitted it
   - Any special requirements

### Respond to a Quote

1. Click the quote in dashboard or quotes list
2. Click "Respond"
3. You can:
   - Add notes/response
   - Update status (pending → responded)
4. Changes save instantly

### Change Admin Password

1. Go to Admin → Settings
2. Enter new password
3. Confirm password
4. Click "Save Settings"
5. **Write down your new password!** You'll need it to login next time

## Tips & Tricks

### Before You Launch

1. ✅ Change admin password from "admin123"
2. ✅ Update your phone number in footer
3. ✅ Update your WhatsApp link
4. ✅ Add your business address
5. ✅ Add your first products
6. ✅ Set realistic prices and turnaround times

### While You're Running

1. Check dashboard every morning - see new quotes
2. Respond to quotes quickly (within 24 hours ideally)
3. Update products when your offerings change
4. Use pricing tiers to encourage bulk orders

### Best Practices

- **Product Descriptions:** Be specific. Tell customers exactly what they're getting.
- **Pricing Tiers:** Offer discounts for larger quantities (attracts bigger orders)
- **Turnaround Times:** Be honest. Better to say 5 days and deliver in 3 than promise 3 and deliver in 5.
- **Contact Fast:** First response time matters. Try to respond to quotes within hours.

## Deployment (Putting It Live on the Internet)

When you're ready to go live:

1. Push code to GitHub (I'll show you how)
2. Create Render account (free)
3. Connect your GitHub repository
4. Set environment variables (admin password)
5. Click "Deploy"
6. Your site is live! 🎉

Your URL will look like: `https://sovereign-prints.onrender.com`

(Full deployment instructions in README.md)

## Troubleshooting

**Website not loading?**
- Make sure server is running: `npm start`
- Check if port 3000 is blocked
- Try http://localhost:3000 (not https)

**Admin password not working?**
- Check you typed it correctly
- Clear browser cookies
- Try private/incognito window

**Products not appearing?**
- Refresh the page (Ctrl+R or Cmd+R)
- Check server is still running in terminal
- Make sure you saved the product

**Having issues?**
- Check browser console: Press F12 → Console tab
- Look for red error messages
- Let me know what you see!

## Support

For detailed documentation, see `README.md`

For API endpoints and technical details, see `README.md` → API Endpoints section

## Questions?

The admin dashboard is designed to be intuitive. Try exploring! Everything is labeled clearly and changes save automatically.

---

**You've got this! 🚀**

Sovereign Prints Website | August 2026
