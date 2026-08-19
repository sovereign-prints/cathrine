# Mobile Responsive Testing Guide

## Quick Test Checklist

### Navigation
- [ ] Click hamburger menu (☰) on mobile
- [ ] Menu opens with slide animation
- [ ] Click a link, menu closes automatically
- [ ] Click hamburger again, menu closes
- [ ] On desktop (> 768px), hamburger disappears and menu shows normally
- [ ] Admin link always visible in navbar

### Homepage (index.html)
- [ ] Hero title "Print. Brand. Stand Out." is readable on phone
- [ ] Hero buttons stack vertically on mobile, horizontally on desktop
- [ ] "What We Do" section displays as single column on mobile
- [ ] Service cards are full-width on phone with proper padding
- [ ] "How It Works" section steps stack on mobile
- [ ] CTA buttons and WhatsApp link are easy to tap
- [ ] Footer text is readable, no text overflow

### Products Page (products.html)
- [ ] Page title "Products & Pricing" displays well on mobile
- [ ] Filter buttons are horizontal and scrollable on mobile
- [ ] Products display as 1 column on mobile
- [ ] Products grid expands to 2+ columns on tablet/desktop
- [ ] Click a product, modal opens properly on mobile (not cut off)
- [ ] Modal content is readable and scrollable
- [ ] Close button (X) is easy to tap
- [ ] "Request Custom Quote" button spans full width in modal on mobile

### Gallery Page (gallery.html)
- [ ] Page loads and displays properly on mobile
- [ ] "Coming Soon" text is readable
- [ ] CTA buttons are stacked on mobile, inline on desktop

### Quote Form (quote.html)
- [ ] Page header displays properly
- [ ] Form label "Your Name" is readable
- [ ] Name input field is full-width with proper padding
- [ ] Email and Phone fields stack on mobile (not side-by-side)
- [ ] Dropdown "What service do you need?" is large enough to tap
- [ ] Textarea for description is full-width with good spacing
- [ ] Checkboxes (Design assistance, Delivery, etc.) are easy to check
- [ ] Submit button is full-width and easy to tap
- [ ] Form labels have good contrast and size (14px+)
- [ ] No horizontal scrolling when filling out form
- [ ] Success message displays properly after submission
- [ ] "What happens next?" info box displays as single column on mobile

### Footer (All Pages)
- [ ] Contact section shows phone, email, location
- [ ] Links in footer are at least 44px tall (easy to tap)
- [ ] Footer sections stack on mobile (1 column)
- [ ] Footer sections go to 2-3 columns on tablet/desktop
- [ ] Footer text is readable and not cramped
- [ ] No text overflow in footer

### Screen Size Tests

#### Mobile (320px - 480px)
```
Device Examples:
- iPhone SE (375px)
- iPhone 12 (390px)
- Pixel 5 (393px)
- Galaxy S10 (360px)

What to verify:
☐ Hamburger menu visible
☐ Text readable without zooming
☐ Buttons are 44px+ tall
☐ No horizontal scrolling
☐ Forms are easy to fill
☐ Images scale properly
```

#### Tablet (481px - 768px)
```
Device Examples:
- iPad Mini (768px)
- Samsung Tab (600px)
- Landscape phone (800px)

What to verify:
☐ Hamburger menu still visible or about to hide
☐ 2-column layouts appearing
☐ Better use of horizontal space
☐ All content readable
☐ No wasted white space
```

#### Desktop (769px+)
```
Device Examples:
- MacBook (1440px)
- Desktop (1920px)
- iPad Pro (1024px+)

What to verify:
☐ Hamburger menu hidden, normal menu visible
☐ Multi-column layouts (3+ columns)
☐ All original styling preserved
☐ Optimal spacing and padding
☐ Professional appearance
```

---

## Font Size Testing

Open Developer Tools and check these sizes:

### Mobile (should be readable without zoom)
- Headings (H1): 28px minimum
- Subheadings (H2, H3): 20px+
- Body text (P): 16px+
- Button text: 16px+
- Form labels: 14px+

### Desktop (can be larger)
- Headings (H1): 40-56px
- Subheadings (H2, H3): 22-40px
- Body text (P): 16-18px
- Button text: 15-16px

---

## Touch Target Testing

On mobile, tap each of these and verify they're easy to tap:

- [ ] Hamburger menu button (should be at least 40x40px)
- [ ] Navigation links (should be tall, 44px minimum)
- [ ] All buttons (44px minimum height)
- [ ] Form inputs (large enough to tap)
- [ ] Checkboxes/Radio buttons (visible and tappable)
- [ ] Footer links (44px minimum height)
- [ ] Close button (X) on modals (should be large)
- [ ] Filter buttons (should be tappable on mobile)

---

## Orientation Testing

### Portrait (phone held vertically)
- [ ] All content fits without horizontal scrolling
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] No layout breaks

### Landscape (phone held horizontally)
- [ ] Content reflows properly
- [ ] Hero section looks good
- [ ] Forms work in landscape
- [ ] No horizontal scrolling
- [ ] Modal displays properly

---

## Common Issues to Look For

### Issue: Text is too small
**Solution:** Check that font sizes match breakpoints in CSS

### Issue: Horizontal scrolling on mobile
**Solution:** Check that all containers have proper max-width and use width: 100% instead of fixed widths

### Issue: Hamburger menu doesn't work
**Solution:** Check browser console for JavaScript errors, verify JavaScript is enabled

### Issue: Buttons are too small to tap
**Solution:** Verify buttons have min-height: 44px and proper padding

### Issue: Modal is cut off on mobile
**Solution:** Check modal max-width is 100% on mobile, scroll is enabled

### Issue: Form inputs look weird on mobile
**Solution:** Check that font-size is 16px (prevents iOS zoom), appearance: none removes browser styling

---

## Testing Tools

### Browser Developer Tools (Free)
1. Press **F12** in Chrome/Firefox/Edge
2. Click the mobile icon (📱) at top-left
3. Select a device preset (iPhone, iPad, etc.)
4. Resize with the handles
5. Test interactions

### Responsive Design Tester (Online)
- https://responsivedesignchecker.com/
- https://mobiletest.me/
- https://www.screenfly.org/

### Real Device Testing
**Best option:** Test on actual phones/tablets
1. Load https://sovereign-prints.onrender.com/ on your phone
2. Test navigation, forms, interactions
3. Check in multiple browsers (Chrome, Safari, Firefox)

---

## Before/After Comparison

### Before Improvements ❌
- Hamburger menu: MISSING
- Mobile fonts: TOO LARGE (56px headings on phones)
- Touch targets: TOO SMALL (not 44px)
- Forms: CRAMPED (poor spacing)
- Modals: OVERSIZED (600px fixed on small screens)
- Navigation: HARD TO USE on mobile
- Layout: Not optimized for small screens

### After Improvements ✅
- Hamburger menu: ✅ WORKING (slides open/closed smoothly)
- Mobile fonts: ✅ OPTIMIZED (28px headings on phones)
- Touch targets: ✅ WCAG COMPLIANT (44px minimum)
- Forms: ✅ SPACIOUS (better spacing, larger inputs)
- Modals: ✅ RESPONSIVE (scales to screen size)
- Navigation: ✅ MOBILE-FRIENDLY (easy hamburger menu)
- Layout: ✅ OPTIMIZED (adapts to any screen size)

---

## Sign-Off Checklist

After testing, verify:

- [ ] Hamburger menu works on mobile
- [ ] All pages display correctly on mobile (320px)
- [ ] All pages display correctly on tablet (768px)
- [ ] All pages display correctly on desktop (1024px+)
- [ ] No horizontal scrolling on any screen size
- [ ] All buttons are tappable (44px+ height)
- [ ] Forms are easy to fill on mobile
- [ ] Modals display properly on all sizes
- [ ] Text is readable without zooming
- [ ] Images scale properly
- [ ] Footer looks good on all sizes
- [ ] No console errors or warnings
- [ ] Orientations (portrait/landscape) work correctly
- [ ] All links and buttons work
- [ ] Performance is acceptable on mobile

---

## Testing Report Template

```
Testing Date: ___________
Tester: ___________
Tested Devices: ___________

Overall Assessment: ☐ PASS ☐ MINOR ISSUES ☐ MAJOR ISSUES

Specific Tests:
- Hamburger menu: ☐ PASS ☐ FAIL
- Mobile fonts: ☐ PASS ☐ FAIL
- Touch targets: ☐ PASS ☐ FAIL
- Forms: ☐ PASS ☐ FAIL
- Modals: ☐ PASS ☐ FAIL
- Navigation: ☐ PASS ☐ FAIL
- Layout: ☐ PASS ☐ FAIL

Issues Found:
1. [Description]
2. [Description]

Ready for Production: ☐ YES ☐ NO

Notes:
```

---

## Questions?

If any issues are found:
1. Note which page and which screen size
2. Take a screenshot
3. Describe what you expected vs. what happened
4. Check browser console for errors
5. Try a different browser to verify it's not a browser-specific issue

