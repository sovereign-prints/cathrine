# Sovereign Prints — Practical Action Plan & Task Breakdown

**Generated from:** SOVEREIGN-PRINTS-EVALUATION-AND-RECOMMENDATIONS.md  
**Date:** September 3, 2026  
**Purpose:** Convert evaluation findings into concrete, assignable tasks

---

## 🎯 IMMEDIATE ACTIONS (This Week)

### Decision Makers
- [ ] Read SOVEREIGN-PRINTS-EXECUTIVE-SUMMARY.md (15 min)
- [ ] Schedule 1-hour team meeting to discuss findings
- [ ] Decide: Proceed with Phase 1? (YES / NO / MAYBE)
- [ ] If YES: Allocate budget ($4K-$6K) and developer time (3-4 weeks)

### Project Manager
- [ ] Create Jira/Asana project for Phase 1
- [ ] Break Phase 1 into 14-day sprints (2 sprints)
- [ ] Identify developer(s) who will implement
- [ ] Set up staging environment for testing
- [ ] Configure analytics tracking (Google Analytics)
- [ ] Create git branches:
  - `phase1/homepage-redesign`
  - `phase1/quote-wizard`
  - `phase1/products-improvements`
  - `phase1/admin-simplification`

### Developer (Planning)
- [ ] Read SOVEREIGN-PRINTS-EVALUATION-AND-RECOMMENDATIONS.md (1-2 hours)
- [ ] Review SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md (1 hour)
- [ ] Estimate effort for each Phase 1 task
- [ ] Identify any architectural questions
- [ ] Set up local development environment

### Admin / Content
- [ ] Gather product descriptions (for all 13 products)
- [ ] Collect high-quality product images (5-10 per product)
- [ ] Select 10-15 gallery images (portfolio work)
- [ ] Write short testimonials or project descriptions
- [ ] Confirm contact information (email, phone, WhatsApp)

---

## 📋 PHASE 1 TASK BREAKDOWN (Weeks 1-4)

### Week 1-2: Homepage Redesign & Quote Form Wizard

#### Task 1.1: Homepage Redesign - Category Cards
**Assigned to:** Frontend Developer  
**Duration:** 2 days  
**Files:** `public/index.html`, `public/styles.css`

**Deliverables:**
- [ ] Replace services grid with 4 category cards (Clothing, Printing, Vinyl, Vehicle)
- [ ] Each card has icon, title, description
- [ ] Cards link to products page with category filter
- [ ] Responsive design (mobile stack vertically)
- [ ] Styling matches brand (navy/indigo theme)

**Acceptance Criteria:**
- Category cards display correctly on desktop (4 columns)
- Cards stack on mobile (single column)
- Click leads to products page with correct filter
- No console errors
- Lighthouse score > 85

**Reference:** SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md "HOMEPAGE REDESIGN"

---

#### Task 1.2: Homepage Redesign - Featured Products Carousel
**Assigned to:** Frontend Developer  
**Duration:** 2 days  
**Files:** `public/index.html`, `public/app.js`, `public/styles.css`

**Deliverables:**
- [ ] Display 6 featured products in carousel/grid
- [ ] Show product image, name, starting price
- [ ] "View Details" button links to product modal
- [ ] Auto-load featured products from API
- [ ] Responsive on all devices

**Acceptance Criteria:**
- Carousel loads without errors
- Products display with correct pricing
- Buttons are clickable
- Mobile: displays 1-2 products per row
- Images load correctly

**Reference:** SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md "Featured Products"

---

#### Task 1.3: Quote Form - Step 1 (Type Selection)
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/quote.html`, `public/quote.js`, `public/styles.css`

**Deliverables:**
- [ ] Replace existing quote form with wizard structure
- [ ] Step 1: Two radio options
  - "Browse & Order" (redirects to products page)
  - "Custom Project" (continues to step 2)
- [ ] Visual wizard progress indicator
- [ ] "Next Step" button

**Acceptance Criteria:**
- Radio buttons work correctly
- "Browse & Order" redirects to products.html
- "Custom Project" advances to step 2
- No form errors
- Mobile responsive

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md "Quote Form Wizard"

---

#### Task 1.4: Quote Form - Step 2 (Project Details)
**Assigned to:** Frontend Developer  
**Duration:** 1.5 days  
**Files:** `public/quote.html`, `public/quote.js`

**Deliverables:**
- [ ] Service category dropdown (load from API)
- [ ] Project description textarea
- [ ] Artwork status radio buttons (Yes/No/Unsure)
- [ ] File upload drag-and-drop area
- [ ] File list display with delete option
- [ ] Back/Next buttons

**Acceptance Criteria:**
- Categories load dynamically from API
- Drag-and-drop works for file upload
- File size validation (max 10MB)
- File type validation (JPG, PNG, PDF)
- Mobile responsive
- No console errors

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md Section 2.1

---

#### Task 1.5: Quote Form - Step 3 (Your Information)
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/quote.html`, `public/quote.js`

**Deliverables:**
- [ ] Name field (required)
- [ ] Email field (required)
- [ ] Phone field (optional)
- [ ] Location field
- [ ] Delivery method radio buttons (4 options)
- [ ] Special requirements checkboxes (4 options)
- [ ] Back/Next buttons

**Acceptance Criteria:**
- All form fields display correctly
- Validation works (required fields)
- Radio buttons and checkboxes work
- Mobile responsive
- Back button returns to step 2
- Next button advances to step 4

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md Section 2.1

---

#### Task 1.6: Quote Form - Step 4 (Review & Submit)
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/quote.html`, `public/quote.js`

**Deliverables:**
- [ ] Display summary of all entered information
- [ ] Show "What happens next" section
- [ ] Show contact information (email, WhatsApp)
- [ ] Back button to step 3
- [ ] Submit button
- [ ] Form validation before submit

**Acceptance Criteria:**
- All data displays correctly
- Submit button triggers form submission
- Form posts to `/api/quotes` endpoint
- No console errors

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md Section 2.1

---

#### Task 1.7: Quote Form - Confirmation Page
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/quote.html`, `public/quote.js`

**Deliverables:**
- [ ] Success message with checkmark
- [ ] Display reference number (QT-XXXXX)
- [ ] Confirmation email address
- [ ] Timeline of what happens next
- [ ] WhatsApp contact button
- [ ] Quote tracking link
- [ ] "Browse More Products" & "Back Home" buttons

**Acceptance Criteria:**
- Confirmation page displays after successful submit
- Reference number displays correctly
- All links are functional
- Mobile responsive

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md Section 2.1

---

#### Task 1.8: Quote Form - Testing & QA
**Assigned to:** QA / Developer  
**Duration:** 1 day  
**Deliverables:**
- [ ] Test all 4 steps on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Test all 4 steps on mobile (iPhone, Android)
- [ ] Test tablet (iPad, Android tablet)
- [ ] Test form validation
- [ ] Test file upload (drag-and-drop, browse)
- [ ] Test form submission to API
- [ ] Verify confirmation page
- [ ] Check for console errors
- [ ] Lighthouse performance score > 85
- [ ] Accessibility audit (WCAG 2.1)

**Acceptance Criteria:**
- All steps work on all devices
- No console errors
- Form submits successfully
- Confirmation displays correctly

**Reference:** SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md "Testing Checklist"

---

### Week 2-3: Products Page Improvements

#### Task 2.1: Add Product Pricing Badges
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/products.html`, `public/products.js`, `public/styles.css`

**Deliverables:**
- [ ] Add badge to product cards:
  - Green "✓ Fixed Pricing" for products with known prices
  - Blue "ⓘ Quote Required" for custom products
- [ ] Badge positioning (top-right corner)
- [ ] Badge styling matches design

**Acceptance Criteria:**
- Badges display on all product cards
- Correct badge for each product type
- Mobile responsive
- No visual issues

**Reference:** SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md "Product Card Details"

---

#### Task 2.2: Display Pricing Tables in Product Modal
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/products.html`, `public/products.js`

**Deliverables:**
- [ ] Modify product modal to show pricing table
- [ ] Table columns: Quantity | Price per unit | Total (estimate)
- [ ] Load pricing from database
- [ ] Format prices with currency (R)
- [ ] Show pricing note for custom-priced items

**Acceptance Criteria:**
- Pricing table displays in modal
- All pricing data correct
- Table is readable on mobile
- Custom-priced items show "Request Quote" note

**Reference:** PHASE-1-IMPLEMENTATION-GUIDE.md Section 3.1

---

#### Task 2.3: Add Turnaround Time Display
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/products.html`, `public/products.js`

**Deliverables:**
- [ ] Display turnaround days on product cards
- [ ] Display turnaround in product detail modal
- [ ] Format as "5 business days" or similar
- [ ] Load from database (turnaround_days field)

**Acceptance Criteria:**
- Turnaround time displays on cards
- Turnaround time shows in modal
- Data loaded from database
- Correctly formatted

---

#### Task 2.4: Improve Product Descriptions
**Assigned to:** Admin/Content + Frontend  
**Duration:** 2 days  
**Deliverables:**
- [ ] Write 2-3 sentence descriptions for all 13 products
- [ ] Add key features/specifications
- [ ] Explain printing methods where relevant
- [ ] Update database records

**Acceptance Criteria:**
- All products have descriptions
- Descriptions are clear and benefit-focused
- Descriptions display in product modal

**Reference:** See database schema in EVALUATION-AND-RECOMMENDATIONS.md Section 1

---

#### Task 2.5: Add Product Category Filtering
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/products.html`, `public/products.js`

**Deliverables:**
- [ ] Add category filter buttons at top of products grid
- [ ] Buttons: All, Clothing, Printing, Vinyl, Signage, Glass, Vehicle
- [ ] Click filters products by category
- [ ] Active filter button is highlighted
- [ ] Responsive on mobile

**Acceptance Criteria:**
- Filter buttons display correctly
- Clicking filter shows only that category
- "All" shows all products
- Mobile responsive

---

#### Task 2.6: Products Page - Testing & QA
**Assigned to:** QA  
**Duration:** 1 day  
**Deliverables:**
- [ ] Test on desktop (all browsers)
- [ ] Test on mobile (iPhone, Android)
- [ ] Test product detail modal
- [ ] Test category filtering
- [ ] Test pricing display
- [ ] Verify descriptions load
- [ ] Check for console errors
- [ ] Lighthouse performance > 85

**Acceptance Criteria:**
- All features work on all devices
- No console errors
- Good performance score

---

### Week 3-4: Admin Simplification

#### Task 3.1: Admin Dashboard - Redesign Structure
**Assigned to:** Frontend Developer  
**Duration:** 2 days  
**Files:** `public/admin.html` (MAJOR REWRITE)

**Deliverables:**
- [ ] Reduce admin.html from 2,138 lines to ~800 lines
- [ ] Simplify overall structure
- [ ] Create simple tab system instead of complex nested divs
- [ ] Move inline styles to CSS
- [ ] Keep all existing functionality

**Acceptance Criteria:**
- File size reduced significantly
- No functionality lost
- Dashboard loads without errors
- All tabs are accessible

**Reference:** SOVEREIGN-PRINTS-EVALUATION-AND-RECOMMENDATIONS.md Section 8

---

#### Task 3.2: Admin Dashboard - Dashboard Tab
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/admin.html`, `public/styles.css`

**Deliverables:**
- [ ] Header: Sovereign Prints logo, Settings, Logout
- [ ] Navigation tabs (easy to understand)
- [ ] Today overview cards:
  - New Quotes count
  - Pending Response count
  - Orders in Production count
  - Invoices Outstanding count
- [ ] Quick action buttons:
  - [+ New Quote]
  - [+ New Product]
  - [+ New Image]
  - [↓ Export Data]
- [ ] Recent quotes table (5 latest)
- [ ] Recent orders table (5 latest)

**Acceptance Criteria:**
- Dashboard displays overview correctly
- Cards show accurate counts
- Tables load correctly
- All buttons are clickable
- Mobile responsive

---

#### Task 3.3: Admin Dashboard - Quotes Tab
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/admin.html`, `public/styles.css`

**Deliverables:**
- [ ] List of all quotes in table format
- [ ] Columns: Date, Customer, Service, Status
- [ ] Filter by status dropdown
- [ ] Search by customer name
- [ ] Click row to show detail panel (side panel)
- [ ] Detail panel shows full quote info
- [ ] Actions: View, Respond, Convert to Order, Delete

**Acceptance Criteria:**
- Quotes load from API
- Filtering works
- Search works
- Click opens detail panel
- All actions are functional

---

#### Task 3.4: Admin Dashboard - Products Tab
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/admin.html`, `public/styles.css`

**Deliverables:**
- [ ] List of all products
- [ ] Each row: Product name, Category, Price, Edit/Delete buttons
- [ ] Drag-to-reorder functionality (indicates visual feedback)
- [ ] [+ Add Product] button
- [ ] Click [Edit] to open edit form
- [ ] Edit form allows: Name, Category, Description, Image, Pricing

**Acceptance Criteria:**
- Products load from API
- Edit form works
- Add product works
- Reordering works (or visual indicator)
- Responsive

---

#### Task 3.5: Admin Dashboard - Gallery Tab
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/admin.html`, `public/styles.css`

**Deliverables:**
- [ ] List of gallery images with thumbnails
- [ ] Each item: Thumbnail, Title, Category, Edit/Delete buttons
- [ ] Drag-to-reorder functionality
- [ ] [+ Upload Images] button
- [ ] Upload form with drag-and-drop
- [ ] Edit form allows: Title, Category, Description

**Acceptance Criteria:**
- Gallery images load
- Edit form works
- Upload works
- Reordering works
- Responsive

---

#### Task 3.6: Admin Dashboard - Settings Tab
**Assigned to:** Frontend Developer  
**Duration:** 1 day  
**Files:** `public/admin.html`, `public/styles.css`

**Deliverables:**
- [ ] Business info section (Company name, location)
- [ ] Contact section (Email, phone, WhatsApp)
- [ ] Working hours section
- [ ] Turnaround times section
- [ ] Delivery options section (with fees)
- [ ] All fields editable
- [ ] [Save] button to update

**Acceptance Criteria:**
- All settings display correctly
- Edit and save work
- Data persists
- Mobile responsive

---

#### Task 3.7: Admin Dashboard - Testing & QA
**Assigned to:** QA  
**Duration:** 1 day  
**Deliverables:**
- [ ] Test dashboard loads
- [ ] Test all tabs are accessible
- [ ] Test quotes management (view, respond, convert, delete)
- [ ] Test products management (add, edit, delete)
- [ ] Test gallery management (add, edit, delete)
- [ ] Test settings updates
- [ ] Test on tablet (admin usage)
- [ ] Check for console errors
- [ ] Verify no functionality lost

**Acceptance Criteria:**
- All admin functions work
- No console errors
- Dashboard is simpler and easier to use
- All data persists correctly

---

## 📊 PHASE 1 SUMMARY TABLE

| Task | Duration | Priority | Dependencies | Status |
|------|----------|----------|---|---|
| **Week 1-2: Homepage & Quote** | | | | |
| 1.1 Category Cards | 2 days | HIGH | - | ☐ |
| 1.2 Featured Products | 2 days | HIGH | 1.1 | ☐ |
| 1.3-1.7 Quote Wizard | 5 days | HIGH | - | ☐ |
| 1.8 Testing | 1 day | HIGH | 1.3-1.7 | ☐ |
| **Week 2-3: Products** | | | | |
| 2.1 Badges | 1 day | MEDIUM | - | ☐ |
| 2.2 Pricing Tables | 1 day | HIGH | 2.1 | ☐ |
| 2.3 Turnaround Time | 1 day | MEDIUM | - | ☐ |
| 2.4 Descriptions | 2 days | MEDIUM | - | ☐ |
| 2.5 Filtering | 1 day | MEDIUM | 2.1 | ☐ |
| 2.6 Testing | 1 day | HIGH | 2.1-2.5 | ☐ |
| **Week 3-4: Admin** | | | | |
| 3.1 Redesign | 2 days | HIGH | - | ☐ |
| 3.2 Dashboard Tab | 1 day | HIGH | 3.1 | ☐ |
| 3.3 Quotes Tab | 1 day | HIGH | 3.1 | ☐ |
| 3.4 Products Tab | 1 day | HIGH | 3.1 | ☐ |
| 3.5 Gallery Tab | 1 day | HIGH | 3.1 | ☐ |
| 3.6 Settings Tab | 1 day | HIGH | 3.1 | ☐ |
| 3.7 Testing | 1 day | HIGH | 3.2-3.6 | ☐ |

**Total Effort:** ~30 days (3.5-4 weeks)  
**Team:** 1 Frontend Developer + 1 QA/Tester + Admin for content

---

## 🔍 DEFINITION OF DONE

Each task must meet these criteria before marking complete:

- [ ] Code written and tested locally
- [ ] No console errors or warnings
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Forms validated (required fields, error messages)
- [ ] API calls working correctly
- [ ] Database queries correct
- [ ] Performance acceptable (Lighthouse > 85)
- [ ] Accessibility meets WCAG 2.1 AA standard
- [ ] Code reviewed and approved
- [ ] Deployed to staging environment
- [ ] QA testing passed
- [ ] Merged to main branch
- [ ] Documentation updated (if needed)

---

## 📈 SUCCESS METRICS

**Track these during and after Phase 1:**

### Quantitative
- Quote completion rate: 60% → 85%+ ✓
- Average form time: 8-10 min → 4-6 min ✓
- Mobile conversion: 15% → 25%+ ✓
- Admin time per quote: 15-20 min → 8-10 min ✓
- Quote response time: 24-48 hrs → < 24 hrs ✓

### Qualitative
- Admin feedback on interface simplification
- Customer feedback on quote form clarity
- Developer feedback on code maintainability

---

## ⚠️ RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Quote form too complex | Schedule | Break into smaller components, test early |
| API endpoint changes break frontend | High | Create feature branches, test integration early |
| Database schema issues | High | Review schema before starting, have backup |
| Mobile responsive issues | Medium | Test on actual devices, not just browser |
| Admin interface breaks existing functionality | Critical | Keep old code, test thoroughly, have rollback plan |

---

## 📞 COMMUNICATION PLAN

### Daily
- 5-min standup (dev, QA, PM)
- Update task board

### Weekly
- 30-min review (all team members)
- Discuss blockers
- Plan next week

### End of Phase
- Demo to stakeholders
- Gather feedback
- Plan Phase 2

---

## 🎓 REFERENCE DOCUMENTS

For each task, refer to:
- **PHASE-1-IMPLEMENTATION-GUIDE.md** — Code examples
- **SOVEREIGN-PRINTS-UI-WIREFRAMES-AND-FLOWS.md** — Visual designs
- **SOVEREIGN-PRINTS-EVALUATION-AND-RECOMMENDATIONS.md** — Technical details

---

**Ready to start? Assign tasks and begin Week 1! →**

