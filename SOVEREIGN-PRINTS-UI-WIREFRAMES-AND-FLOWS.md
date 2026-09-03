# Sovereign Prints — UI Wireframes & Customer Flows

**Purpose:** Visual representation of recommended UI changes for Phase 1

---

## HOMEPAGE REDESIGN

### Current State Problem
```
┌─────────────────────────────────┐
│  Navbar                         │
├─────────────────────────────────┤
│  Hero: Print. Brand. Stand Out. │
│  [Browse Products] [Get Quote]  │
├─────────────────────────────────┤
│  "What We Do" (Services Grid)   │
│  ❌ Doesn't explain products    │
├─────────────────────────────────┤
│  "How It Works" (3 steps)       │
├─────────────────────────────────┤
│  CTA: "Got something in mind?"  │
├─────────────────────────────────┤
│  Footer                         │
└─────────────────────────────────┘
```

**Issues:**
- Too generic
- Services grid confuses rather than helps
- No clear product entry points
- No pricing visible

---

### Recommended Homepage

```
┌─────────────────────────────────────────┐
│ Sovereign Prints  [Menu]      [WhatsApp] │
├─────────────────────────────────────────┤
│                                         │
│          Print. Brand. Stand Out.       │
│                                         │
│  [Browse Our Products] [Get a Quote]    │
│                                         │
├─────────────────────────────────────────┤
│  WHAT WE SPECIALIZE IN                  │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐             │
│  │ Clothing │  │ Printing │             │
│  │ T-Shirts │  │ Business │             │
│  │ Hoodies  │  │ Cards    │             │
│  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐             │
│  │ Vinyl    │  │ Vehicle  │             │
│  │ Decals   │  │ Branding │             │
│  │ Graphics │  │ Wraps    │             │
│  └──────────┘  └──────────┘             │
├─────────────────────────────────────────┤
│  OUR MOST POPULAR PRODUCTS              │
├─────────────────────────────────────────┤
│  ┌───────┐  ┌───────┐  ┌───────┐       │
│  │ T-Sh..│  │ Bus..│  │ Vinyl │       │
│  │Starti..│  │Starti..│  │ Starti...│  │
│  │  View  │  │  View  │  │  View  │   │
│  └───────┘  └───────┘  └───────┘       │
│  ┌───────┐                              │
│  │ More..│                              │
│  └───────┘                              │
├─────────────────────────────────────────┤
│  HOW IT WORKS                           │
├─────────────────────────────────────────┤
│                                         │
│  1. Browse or Request                   │
│     Explore products or tell us          │
│     exactly what you need                │
│                                         │
│  2. Get a Quote                         │
│     We respond within 24 hours           │
│     with pricing and details             │
│                                         │
│  3. Production & Delivery                │
│     We handle production and             │
│     arrange delivery or pickup           │
│                                         │
├─────────────────────────────────────────┤
│  SEE OUR WORK                           │
│  [Gallery Grid - 3-4 images]            │
│  [View Gallery]                         │
├─────────────────────────────────────────┤
│  Got a custom project in mind?          │
│  [Start a Quote] [WhatsApp Us]          │
├─────────────────────────────────────────┤
│  Footer (Contact, Links)                │
└─────────────────────────────────────────┘
```

**Key Improvements:**
✅ Category cards instead of vague services  
✅ Popular products carousel with starting prices  
✅ Gallery integration  
✅ Clear CTAs throughout  
✅ WhatsApp contact visible  

---

## PRODUCTS PAGE REDESIGN

### Current State (Problematic)

```
All Products  [Category Tabs]

┌──────────┐  ┌──────────┐  ┌──────────┐
│ Product  │  │ Product  │  │ Product  │
│ Card     │  │ Card     │  │ Card     │
│ [View]   │  │ [View]   │  │ [View]   │
└──────────┘  └──────────┘  └──────────┘

Problem: No price info, all require quotes
```

### Recommended Products Page

#### Desktop Layout

```
┌─────────────────────────────────────────┐
│ Products & Pricing                      │
├─────────────────────────────────────────┤
│ [All] [Clothing] [Printing] [Vinyl]...  │
│ Price: [All ▼]  Turnaround: [All ▼]    │
├─────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐     │
│ │              │  │              │     │
│ │  T-Shirt     │  │ Business     │     │
│ │  Printing    │  │ Cards        │     │
│ │              │  │              │     │
│ │  Starting at │  │  From R250   │     │
│ │  R120        │  │              │     │
│ │              │  │  [View      │     │
│ │  Printing    │  │   Details]  │     │
│ │  method in   │  │              │     │
│ │  quote       │  │  ⓘ Fixed    │     │
│ │              │  │    pricing  │     │
│ │  ⓘ Quote     │  │              │     │
│ │    required  │  │              │     │
│ │              │  │              │     │
│ │  [View       │  │  [Request    │     │
│ │   Details]   │  │   Quote]     │     │
│ └──────────────┘  └──────────────┘     │
│                                         │
│ ┌──────────────┐  ┌──────────────┐     │
│ │ Vehicle      │  │ Custom Glass │     │
│ │ Wrap         │  │ & Mugs       │     │
│ │              │  │              │     │
│ │ Full service │  │ From R95     │     │
│ │ quote        │  │              │     │
│ │              │  │  [View      │     │
│ │ [View        │  │   Details]  │     │
│ │  Details]    │  │              │     │
│ └──────────────┘  └──────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

#### Product Card Details

**Tier 1 - Fixed Pricing Card:**
```
┌────────────────────┐
│  [Product Image]   │ ← Multiple images indicated
│   (2 more)         │   by badge
├────────────────────┤
│ Product Name       │
│                    │
│ From R250          │
│ ⓘ Fixed pricing   │
│                    │
│ Qty: 100 → 500 +   │ ← Price varies by qty
│                    │
│ [View Details]     │
│ [Request Quote]    │
└────────────────────┘
```

**Tier 2 - Configurable Card:**
```
┌────────────────────┐
│  [Product Image]   │
├────────────────────┤
│ Product Name       │
│                    │
│ Estimated R500-800 │
│ ⓘ Depends on opts  │
│                    │
│ [Configure & Get   │
│  Estimate]         │
│                    │
│ [Request Quote]    │
└────────────────────┘
```

**Tier 3 - Quote Only Card:**
```
┌────────────────────┐
│  [Product Image]   │
├────────────────────┤
│ Product Name       │
│                    │
│ Custom pricing     │
│ ⓘ Quote required   │
│                    │
│ [View Examples]    │
│                    │
│ [Request Quote]    │
└────────────────────┘
```

#### Product Detail Modal

```
┌─────────────────────────────────────────┐
│ × Close                                 │
├─────────────────────────────────────────┤
│                                         │
│  [Large Product Image]                  │
│  [Thumbnail 1] [Thumbnail 2] [Thumb 3] │
│                                         │
│  T-Shirt Printing                       │
│                                         │
│  Custom branded T-shirts for            │
│  businesses and events.                 │
│                                         │
│  PRICING BY QUANTITY                    │
│  ┌──────────────────────────────────┐  │
│  │ Quantity │ Price per unit │ Total │  │
│  ├──────────────────────────────────┤  │
│  │ 50-100   │ R120            │ R6K  │  │
│  │ 101-250  │ R95             │ R24K │  │
│  │ 251-500  │ R80             │ R40K │  │
│  │ 500+     │ R65             │ Call │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ⓘ Prices for 1-color print on front.   │
│    Multi-color and back print cost      │
│    more. See examples or request quote. │
│                                         │
│  SPECIFICATIONS                         │
│  - Available sizes: XS to 3XL           │
│  - Material: 100% cotton                │
│  - Print method: Screen or DTG          │
│  - Turnaround: 5 business days          │
│                                         │
│  [Request Custom Quote]                 │
│  [View Similar Products] [Close]        │
│                                         │
└─────────────────────────────────────────┘
```

---

## QUOTE FORM REDESIGN

### Current State (Too Long)

```
Long single form with:
- Name, email, phone
- Service dropdown (hardcoded)
- Description textarea
- Requirements checkboxes
- File upload
- Submit

Problem: Feels overwhelming, no guidance
```

### Recommended: Step-by-Step Wizard

#### Step 1: What Do You Need?

```
┌─────────────────────────────────────────┐
│ Get a Quote                             │
│ Step 1 of 4                             │
├─────────────────────────────────────────┤
│                                         │
│ What do you need?                       │
│                                         │
│ ◉ I want to browse & order a            │
│   standard product                      │
│   (Show me pricing and sizes)           │
│                                         │
│ ◯ I need a custom or complex            │
│   project                               │
│   (Tell me about your idea)             │
│                                         │
│                           [Next Step →] │
│                                         │
└─────────────────────────────────────────┘
```

**Logic:** If "standard" selected → redirect to Products page with CTA  
If "custom" selected → continue to Step 2

#### Step 2: Project Details

```
┌─────────────────────────────────────────┐
│ Get a Quote                             │
│ Step 2 of 4                             │
├─────────────────────────────────────────┤
│                                         │
│ Tell us about your project              │
│                                         │
│ What type of project? *                 │
│ [Select Category ▼]                     │
│ ❌ Loading categories from API...       │
│   ✅ Found: Clothing, Printing, Vinyl.. │
│                                         │
│ Project Description *                  │
│ [Large textarea]                        │
│ "What do you need? Who is it for?      │
│  Any special requirements?"             │
│                                         │
│ Do you have artwork ready?              │
│ ◉ Yes, I'll attach it                   │
│ ◯ No, I need design help                │
│ ◯ Undecided                             │
│                                         │
│ Attach files (optional)                 │
│ [Drag files or browse]                  │
│ Max 5 files, 10MB each                  │
│ Accepted: JPG, PNG, PDF                 │
│                                         │
│ [← Back] [Next Step →]                  │
│                                         │
└─────────────────────────────────────────┘
```

#### Step 3: Your Information

```
┌─────────────────────────────────────────┐
│ Get a Quote                             │
│ Step 3 of 4                             │
├─────────────────────────────────────────┤
│                                         │
│ Your Information                        │
│                                         │
│ Name *                                  │
│ [Text field]                            │
│                                         │
│ Email *                                 │
│ [Email field]                           │
│                                         │
│ Phone (Optional)                        │
│ [Phone field]                           │
│                                         │
│ Location                                │
│ [City/Suburb field]                     │
│                                         │
│ Delivery Method                         │
│ ◉ Johannesburg pickup                   │
│ ◯ Delivery in Gauteng (+R150)           │
│ ◯ National courier (+R300)              │
│ ◯ Client pickup                         │
│                                         │
│ Any special requirements?               │
│ ☐ Design assistance (if no artwork)    │
│ ☐ Shipping/Delivery included            │
│ ☐ Installation/Application service      │
│ ☐ Express/Rush timeline                 │
│                                         │
│ [← Back] [Next Step →]                  │
│                                         │
└─────────────────────────────────────────┘
```

#### Step 4: Review & Submit

```
┌─────────────────────────────────────────┐
│ Get a Quote                             │
│ Step 4 of 4 - Review                    │
├─────────────────────────────────────────┤
│                                         │
│ PROJECT SUMMARY                         │
│ ───────────────────────────────────     │
│ Type: T-Shirt Printing                  │
│ Description: 50 custom T-shirts...      │
│ Artwork: Yes, logo.png attached         │
│                                         │
│ YOUR INFORMATION                        │
│ ───────────────────────────────────     │
│ Name: John Smith                        │
│ Email: john@example.com                 │
│ Phone: 555-1234                         │
│ Location: Johannesburg                  │
│ Delivery: Johannesburg pickup           │
│                                         │
│ WHAT HAPPENS NEXT                       │
│ ───────────────────────────────────     │
│ 1. We receive your quote (takes <1min) │
│ 2. We review your artwork & specs      │
│ 3. We send you a quote within 24 hours │
│ 4. You confirm or suggest changes      │
│ 5. We arrange payment & production     │
│                                         │
│ Questions? Email us at:                 │
│ hello@sovereignprints.co.za             │
│ Or WhatsApp: +27 82 312 3456            │
│                                         │
│ [← Back] [Submit Quote]                 │
│                                         │
└─────────────────────────────────────────┘
```

#### Confirmation Page

```
┌─────────────────────────────────────────┐
│ ✅ Quote Submitted                      │
├─────────────────────────────────────────┤
│                                         │
│ Your reference number:                  │
│ QT-202609-001                           │
│                                         │
│ Save this for your records!             │
│ You can track your quote at:            │
│ sovereignprints.co.za/track?id=QT-2... │
│                                         │
│ We've sent a confirmation email to:     │
│ john@example.com                        │
│                                         │
│ WHAT HAPPENS NEXT                       │
│ We're currently reviewing your          │
│ request. You'll hear from us within     │
│ 24 hours with pricing and details.      │
│                                         │
│ Can't wait? Message us on WhatsApp:     │
│ [WhatsApp Button]                       │
│                                         │
│ [Browse More Products]  [Back Home]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## QUOTE TRACKING PAGE (Phase 2)

### Accessed via: `/?track=QT-001`

```
┌─────────────────────────────────────────┐
│ Track Your Quote                        │
├─────────────────────────────────────────┤
│                                         │
│ Quote #QT-202609-001                    │
│ For: John Smith                         │
│ Service: T-Shirt Printing               │
│                                         │
│ STATUS: Awaiting Response               │
│                                         │
│ Timeline:                               │
│ ┌───────────────────────────────────┐  │
│ │ Sep 3, 10:45 AM                   │  │
│ │ ✓ Quote received                  │  │
│ │                                   │  │
│ │ Sep 3, 2:00 PM (est.)             │  │
│ │ ⏳ Review in progress              │  │
│ │                                   │  │
│ │ Sep 4, 10:00 AM (est.)            │  │
│ │ ○ Response sent                   │  │
│ │                                   │  │
│ │ Sep 4 - Sep 10                    │  │
│ │ ○ Production (if approved)        │  │
│ │                                   │  │
│ │ Sep 11                            │  │
│ │ ○ Delivery/Pickup                 │  │
│ └───────────────────────────────────┘  │
│                                         │
│ QUOTE DETAILS                           │
│ Type: T-Shirt Printing                  │
│ Quantity: 50 units                      │
│ Delivery: Johannesburg pickup           │
│                                         │
│ Attachments: logo.png                   │
│                                         │
│ HAVE A QUESTION?                        │
│ Message us here:                        │
│ [Message box]                           │
│ [Send]                                  │
│                                         │
│ Messages (None yet)                     │
│                                         │
│ Questions? Contact:                     │
│ hello@sovereignprints.co.za             │
│ WhatsApp: +27 82 312 3456               │
│                                         │
└─────────────────────────────────────────┘
```

---

## ADMIN DASHBOARD REDESIGN

### Current State (Problem)
- 2,138 lines of HTML
- Multiple overlapping tabs
- Complex form layouts
- Difficult to maintain

### Recommended: Simplified Dashboard

#### Dashboard Home Tab

```
┌──────────────────────────────────────────────┐
│ Sovereign Prints Admin    [Settings] [Logout]│
├──────────────────────────────────────────────┤
│ [Dashboard] [Quotes] [Orders] [Products]     │
│ [Gallery] [Settings] [Data]                  │
├──────────────────────────────────────────────┤
│                                              │
│ TODAY                                        │
│ ┌──────────────────┬──────────────────┐     │
│ │ New Quotes: 3    │ Pending Response:5 │    │
│ │ New Orders: 1    │ In Production: 2  │    │
│ └──────────────────┴──────────────────┘     │
│                                              │
│ QUICK ACTIONS                                │
│ [+ New Quote]  [+ New Product]               │
│ [+ Image]      [↓ Export Data]               │
│                                              │
│ RECENT QUOTES                                │
│ ┌─────────────────────────────────────────┐ │
│ │ Date   │ Customer    │ Service │ Status │ │
│ ├─────────────────────────────────────────┤ │
│ │ Sep 3  │ John Smith  │ T-Shirt │ Quoted │ │
│ │ Sep 3  │ Mary Jones  │ Vinyl   │ Quoted │ │
│ │ Sep 2  │ Dave White  │ Signage │ Quoted │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ RECENT ORDERS                                │
│ ┌─────────────────────────────────────────┐ │
│ │ ID     │ Customer    │ Items   │ Status  │ │
│ ├─────────────────────────────────────────┤ │
│ │ ORD-01 │ John Smith  │ T-Shirt │ Process │ │
│ │ ORD-02 │ Bob Lee     │ Cards   │ Ready   │ │
│ └─────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

#### Quotes Tab

```
┌──────────────────────────────────────────────┐
│ Sovereign Prints Admin    [Settings] [Logout]│
├──────────────────────────────────────────────┤
│ [Dashboard] [Quotes] [Orders] [Products]     │
│ [Gallery] [Settings] [Data]                  │
├──────────────────────────────────────────────┤
│                                              │
│ Quotes                                       │
│ [Search] [Filter by Status ▼]                │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ Date   │ Customer │ Service │ Status  │  │ │
│ ├─────────────────────────────────────────┤ │
│ │ Sep 3  │ John S   │ T-Shirt │ Quoted  │  │ │ → Click to view
│ │ Sep 3  │ Mary J   │ Vinyl   │ Quoted  │  │ │ → Side panel appears
│ │ Sep 2  │ Dave W   │ Signage │ Pending │  │ │
│ │ Sep 1  │ Alice L  │ Clothing│ Pending │  │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ [Showing 1-10 of 47 quotes]                  │
│ [< Previous] [1] [2] [3] [Next >]            │
│                                              │
└──────────────────────────────────────────────┘

                    ↓
            (Click on a quote)
                    ↓

┌──────────────────┐
│ Quote #QT-001    │  Side Panel
│ ═════════════    │
│ Customer:        │
│ John Smith       │
│                  │
│ Email:           │
│ john@ex.com      │
│                  │
│ Phone:           │
│ 555-1234         │
│                  │
│ Date:            │
│ Sep 3, 10:45 AM  │
│                  │
│ Status:          │
│ [Quoted ▼]       │
│                  │
│ Service:         │
│ T-Shirt Printing │
│                  │
│ Description:     │
│ 50 custom...     │
│                  │
│ Notes:           │
│ [Add notes...]   │
│                  │
│ Attachments:     │
│ logo.png         │
│                  │
│ [Respond]        │
│ [Convert Order]  │
│ [Delete]         │
│                  │
└──────────────────┘
```

#### Products Tab

```
┌──────────────────────────────────────────────┐
│ Sovereign Prints Admin    [Settings] [Logout]│
├──────────────────────────────────────────────┤
│ [Dashboard] [Quotes] [Orders] [Products]     │
│ [Gallery] [Settings] [Data]                  │
├──────────────────────────────────────────────┤
│                                              │
│ Products [+ Add Product]                     │
│ [Search] [Filter: Active ▼]                  │
│                                              │
│ Drag to reorder:                             │
│                                              │
│ 1. T-Shirt Printing         [Edit] [Delete] │
│    Active, Clothing, R120                   │
│                                              │
│ 2. Hoodie Printing          [Edit] [Delete] │
│    Active, Clothing, R250                   │
│                                              │
│ 3. Cap Branding             [Edit] [Delete] │
│    Active, Clothing, R85                    │
│                                              │
│ 4. Business Cards           [Edit] [Delete] │
│    Active, Printing, R350                   │
│                                              │
│ 5. Vinyl Decals             [Edit] [Delete] │
│    Active, Vinyl, R150                      │
│                                              │
│ ...                                          │
│                                              │
└──────────────────────────────────────────────┘

                    ↓
              Click [Edit]
                    ↓

┌──────────────────────────────────────────┐
│ Edit Product: T-Shirt Printing          │
│                                          │
│ Product Name: T-Shirt Printing           │
│ Category: [Clothing ▼]                   │
│ Active: [✓]                              │
│                                          │
│ Description:                             │
│ [Text area]                              │
│ Custom branded T-shirts for businesses   │
│ and events.                              │
│                                          │
│ Specifications:                          │
│ [Text area]                              │
│ Various sizes, single or multi-color     │
│ prints                                   │
│                                          │
│ Base Price: R[120]                       │
│ Turnaround: [5] days                     │
│                                          │
│ Product Images:                          │
│ [Drag images or browse]                  │
│                                          │
│ [Thumbnail] [Thumbnail] [Thumbnail]     │
│  ✎ Reorder by dragging                  │
│  ✕ Click to delete                       │
│                                          │
│ Pricing Tiers:                           │
│ [Edit Tiers]                             │
│                                          │
│ [Save] [Cancel]                          │
│                                          │
└──────────────────────────────────────────┘

                    ↓
          Click [Edit Tiers]
                    ↓

┌──────────────────────────────────────────┐
│ Pricing Tiers: T-Shirt Printing          │
│                                          │
│ Size: [All ▼]                            │
│                                          │
│ Quantity Range │ Price per unit          │
│ ───────────────────────────────────      │
│ 50-100         │ R[120]    [Delete]      │
│ 101-250        │ R[95]     [Delete]      │
│ 251-500        │ R[80]     [Delete]      │
│ 500+           │ R[65]     [Delete]      │
│                                          │
│ [+ Add Tier]                             │
│                                          │
│ [Save] [Cancel]                          │
│                                          │
└──────────────────────────────────────────┘
```

---

## MOBILE EXPERIENCE

### Homepage (Mobile)

```
┌─────────────────────┐
│ ☰        Logo    ☎  │ ← Hamburger menu
├─────────────────────┤
│                     │
│ Print. Brand.       │
│ Stand Out.          │
│                     │
│ [Browse Products]   │
│ [Get a Quote]       │
│                     │
├─────────────────────┤
│ WHAT WE DO          │
│                     │
│ [Clothing]          │ ← Stack vertically
│ Clothing & Apparel  │
│                     │
│ [Printing]          │
│ Business Printing   │
│                     │
│ [Vinyl]             │
│ Vinyl & Graphics    │
│                     │
│ [Vehicle]           │
│ Vehicle Branding    │
│                     │
├─────────────────────┤
│ POPULAR PRODUCTS    │
│                     │
│ ┌────────────────┐  │
│ │ T-Shirt        │  │
│ │ Starting R120  │  │
│ │ [View Details] │  │
│ └────────────────┘  │
│                     │
│ ┌────────────────┐  │
│ │ Business Cards │  │
│ │ From R250      │  │
│ │ [View Details] │  │
│ └────────────────┘  │
│                     │
│ ┌────────────────┐  │
│ │ Vinyl Decals   │  │
│ │ From R150      │  │
│ │ [View Details] │  │
│ └────────────────┘  │
│                     │
├─────────────────────┤
│ HOW IT WORKS        │
│                     │
│ 1. Browse/Request   │
│ Explore or tell us  │
│                     │
│ 2. Get a Quote      │
│ Within 24 hours     │
│                     │
│ 3. Production       │
│ Delivery/Pickup     │
│                     │
├─────────────────────┤
│ GALLERY             │
│                     │
│ ┌─────┐ ┌─────┐    │
│ │ Img1│ │ Img2│    │
│ └─────┘ └─────┘    │
│ ┌─────┐ ┌─────┐    │
│ │ Img3│ │ Img4│    │
│ └─────┘ └─────┘    │
│ [View Gallery]     │
│                     │
├─────────────────────┤
│ Got a custom idea?  │
│                     │
│ [Start a Quote]     │
│                     │
│ [WhatsApp Us]       │
│                     │
├─────────────────────┤
│ CONTACT             │
│ ✉ hello@...         │
│ 📍 Johannesburg     │
│                     │
│ [WhatsApp Button]   │
│                     │
└─────────────────────┘
```

### Quote Form (Mobile) - Step-by-Step

**Step 1:**
```
┌──────────────────┐
│ Get a Quote      │
│ Step 1 of 4      │
├──────────────────┤
│ What do you need?│
│                  │
│ ◉ Browse products│
│                  │
│ ◯ Custom project │
│                  │
│                  │
│                  │
│                  │
│ [Next Step →]    │
│                  │
└──────────────────┘
```

---

## COLOR & STYLING GUIDE

### Existing Colors (Keep)
- Primary: Navy #16213e
- Accent: Indigo #4f46e5
- Text: Dark gray #1f2937
- Light bg: #f3f4f6
- White: #ffffff

### New Badges & Status
- ✅ Fixed Pricing: Green #10b981
- ℹ️ Quote Required: Blue #3b82f6
- ⏳ Awaiting: Amber #f59e0b
- ✓ Approved: Green #10b981
- ✕ Cancelled: Red #ef4444

### Form & Interactive
- Active state: #4f46e5
- Hover state: #4338ca
- Focus state: Blue outline
- Error state: #ef4444
- Success state: #10b981

---

## USER FLOW DIAGRAMS

### Standard Order Flow

```
                     [Homepage]
                          ↓
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
      [Browse]      [Category]      [Get Quote]
        Products      Shortcuts       Form
            ↓              ↓              ↓
      [Products       [Filter by        [Free-form
       Page]          Category]         Description]
            ↓              ↓              ↓
      [View Tier 1]   [View      [Submit Quote]
       Product]       Product]
            ↓              ↓              ↓
      [Click View]   [Click View]  [Receive
       Details]       Details]     QT-XXXXX]
            ↓              ↓              ↓
      [See Price]    [See Price]   [Confirmation
       Tables]        Tables]        Email]
            ↓              ↓              ↓
      [Request Quote] [Request Quote] [Track
       OR Buy]         (if needed)     Quote]
            ↓              ↓              ↓
      [Checkout]     [Quote Form]  [Wait for
       Form]          Submitted]    Response]
            ↓              ↓              ↓
      [Submit Quote] [Receive QT]  [Admin sends
                      [Track]       Formal Quote]
                                        ↓
                                   [Customer
                                    Approves]
                                        ↓
                                   [Payment]
                                        ↓
                                   [Order
                                    Confirmed]
                                        ↓
                                   [Production]
                                        ↓
                                   [Delivery]
```

### Admin Quote-to-Invoice Flow

```
[Admin Dashboard]
        ↓
[Quotes Tab]
        ↓
[View Quote]
        ↓
    ┌───┴────────────────┐
    ↓                    ↓
[Respond       [Mark as Quoted]
 with Message]          ↓
    ↓          [Send Quote PDF
    ↓          via Email]
    ↓                    ↓
    └────────┬───────────┘
             ↓
    [Customer Approves]
             ↓
    [Convert to Order]
             ↓
    [Order Created]
             ↓
    [Update Status]
             ↓
    [Email Sent to Customer]
             ↓
    [Status: In Production]
             ↓
    [Status: Ready]
             ↓
    [Generate Invoice]
             ↓
    [Invoice PDF]
             ↓
    [Send to Customer]
             ↓
    [Payment Received]
             ↓
    [Status: Delivered]
```

---

## SUCCESS METRICS

### Phase 1 Goals (After Homepage/Form Redesign)

| Metric | Current | Target | Method |
|--------|---------|--------|--------|
| Quote form completion rate | ~60% | 85%+ | Google Analytics |
| Avg time in quote form | 8-10 min | 4-6 min | Form field analytics |
| Mobile conversion rate | 15% | 25%+ | Analytics |
| Bounce rate (products page) | 45% | 25% | Analytics |
| Admin time per quote | 15-20 min | 8-10 min | Time tracking |
| Quote response time | 24-48 hrs | < 24 hrs | Manual tracking |

### Phase 2 Goals (After Tracking/Orders)

| Metric | Target | Method |
|--------|--------|--------|
| Customer repeat orders | +40% | Order database |
| Quote-to-order conversion | 60%+ | Quote tracking |
| Admin quote volume handled | 2-3x | Activity log |
| Quote status inquiries | -70% | Email tracking |

---

## TESTING CHECKLIST

### Phase 1 Testing

**Functionality:**
- [ ] Homepage loads without errors
- [ ] Category shortcuts work
- [ ] Featured carousel displays
- [ ] Quote wizard advances through all steps
- [ ] File upload works
- [ ] Form validation works
- [ ] Confirmation page displays correct QT number
- [ ] Products page filters work
- [ ] Product detail modal displays correctly
- [ ] Pricing tables show correctly
- [ ] Admin dashboard loads
- [ ] Admin can create product
- [ ] Admin can upload images
- [ ] Admin can view quotes

**Performance:**
- [ ] Homepage loads in < 3 seconds
- [ ] Mobile Performance score > 85
- [ ] Desktop Performance score > 90
- [ ] No console errors

**Mobile:**
- [ ] Hamburger menu works
- [ ] Touch interactions responsive
- [ ] Forms readable
- [ ] Images scale properly
- [ ] No horizontal scrolling

**Accessibility:**
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## ROLLOUT PLAN

### Week 1-2 Deployment
1. Deploy homepage redesign to staging
2. QA testing (team + stakeholders)
3. Deploy to production
4. Monitor analytics for issues

### Week 2-3 Deployment  
1. Deploy products page improvements
2. QA testing
3. Deploy to production

### Week 3-4 Deployment
1. Deploy quote form wizard
2. QA testing with real customers
3. Deploy to production
4. Admin training

### Post-Launch
1. Monitor completion rates
2. Collect user feedback
3. Adjust based on data
4. Plan Phase 2

