# Content Update Checklist

Use this checklist to ensure you've updated all placeholder content with your actual church information.

## 🔴 CRITICAL - Update Immediately

### Contact Information
- [ ] Phone number in Footer (`/src/app/components/footer.tsx`)
  - Line: `+254 700 000 000`
- [ ] Email in Footer (`/src/app/components/footer.tsx`)
  - Line: `info@stfrancischeptarit.org`
- [ ] Address in Footer (`/src/app/components/footer.tsx`)
  - Verify: Cheptarit, Mosoriot, Nandi County, Kenya
- [ ] All contact info in Contact page (`/src/app/pages/contact.tsx`)
  - Parish office phone
  - Emergency phone
  - Email addresses
  - Office hours

### Mass Times
- [ ] Sunday Mass times (`/src/app/pages/mass-times.tsx`)
  - Currently: 7:00 AM, 10:00 AM, 5:00 PM
- [ ] Weekday Mass times (`/src/app/pages/mass-times.tsx`)
  - Currently: Monday-Saturday at 6:00 AM
- [ ] Confession times (`/src/app/pages/mass-times.tsx`)
  - Currently: Saturday 4:00-5:00 PM
- [ ] Special services schedule (`/src/app/pages/mass-times.tsx`)
  - Adoration, Rosary, Stations of the Cross

## 🟡 HIGH PRIORITY - Update Soon

### Clergy & Staff
- [ ] Parish Priest name and bio (`/src/app/pages/about.tsx`)
  - Currently: Fr. John Kamau
- [ ] Associate Pastor name and bio (`/src/app/pages/about.tsx`)
  - Currently: Fr. Peter Ochieng
- [ ] Add photos of clergy (if available)

### Church History
- [ ] Founding date (`/src/app/pages/about.tsx`)
  - Currently: "early 1970s" and "over 50 years"
- [ ] Church history narrative (`/src/app/pages/about.tsx`)
  - Update with your actual story
- [ ] Mission statement (`/src/app/pages/about.tsx`)
  - Review and personalize if needed

### Events
- [ ] Current upcoming events (`/src/app/pages/events.tsx`)
  - Replace placeholder events with real ones
  - Update dates (currently showing April 2026)
- [ ] Annual events calendar (`/src/app/pages/events.tsx`)
  - Verify dates for major celebrations
  - Add parish-specific events

### Ministries
- [ ] Ministry coordinator names (`/src/app/pages/ministries.tsx`)
  - Update all 12 ministry contact names
- [ ] Ministry meeting times (`/src/app/pages/ministries.tsx`)
  - Verify days and times for each ministry
- [ ] Add or remove ministries as needed

## 🟢 MEDIUM PRIORITY - Update When Possible

### Giving & Donations
- [ ] Mobile money details (`/src/app/pages/giving.tsx`)
  - Update paybill number: Currently "123456"
  - Update account instructions
- [ ] Bank account information (`/src/app/pages/giving.tsx`)
  - Add actual bank details (contact office)
- [ ] Current fundraising campaigns (`/src/app/pages/giving.tsx`)
  - Update "Church Roof Repair Fund" or replace with current campaign
  - Update goal amount and progress percentage
- [ ] Financial breakdown percentages (`/src/app/pages/giving.tsx`)
  - Verify 60% / 25% / 15% split is accurate

### Images & Photos
- [ ] Hero image on Home page (`/src/app/pages/home.tsx`)
  - Replace Unsplash photo with your church photo
- [ ] Consider adding a photo gallery page
- [ ] Add clergy photos to About page
- [ ] Add event photos to Events page

### Social Media
- [ ] Facebook link (`/src/app/components/footer.tsx`)
  - Currently: `href="#"`
- [ ] Instagram link (`/src/app/components/footer.tsx`)
  - Currently: `href="#"`
- [ ] Add other social media platforms if needed

## 🔵 LOW PRIORITY - Nice to Have

### Additional Content
- [ ] Add actual Google Maps embed (`/src/app/pages/contact.tsx`)
- [ ] Create parish bulletin page
- [ ] Add photo gallery
- [ ] Add prayer resources page
- [ ] Add saint of the day feature
- [ ] Add daily Mass readings link

### Functionality
- [ ] Connect contact form to email service
- [ ] Add online giving integration
- [ ] Add event registration forms
- [ ] Add newsletter signup

### SEO & Meta
- [ ] Add meta descriptions to each page
- [ ] Add Open Graph tags for social sharing
- [ ] Add favicon
- [ ] Add sitemap

## Content Review Schedule

### Weekly
- Update upcoming events
- Review and update bulletin/announcements

### Monthly
- Check all contact information is current
- Update ministry meeting schedules
- Review and update donation campaigns

### Quarterly
- Update clergy information if changes
- Review and refresh church history/about content
- Update photo gallery

### Annually
- Review all content for accuracy
- Update annual events calendar
- Refresh mission and vision statements

## Quick Reference: What's in Each File

### `/src/app/components/footer.tsx`
- Church name and description
- Quick links
- Contact info (phone, email, address)
- Social media links

### `/src/app/components/header.tsx`
- Church name in logo
- Navigation links (can add/remove pages)

### `/src/app/pages/home.tsx`
- Hero section with main church image
- Welcome message
- Core values (3 cards)
- Upcoming events preview (4 events)
- Call to action sections

### `/src/app/pages/about.tsx`
- Church history (full narrative)
- Mission and vision
- Clergy profiles
- Sacraments offered

### `/src/app/pages/mass-times.tsx`
- All Mass times (Sunday & Weekday)
- Confession schedule
- Special devotions schedule
- Location and directions

### `/src/app/pages/ministries.tsx`
- 12 different ministries
- Contact person for each
- Meeting times and descriptions
- Small Christian Communities info

### `/src/app/pages/events.tsx`
- Upcoming events list
- Past events
- Annual calendar
- Event categories

### `/src/app/pages/contact.tsx`
- Contact form
- Office hours
- All contact methods
- FAQ section
- Map location

### `/src/app/pages/giving.tsx`
- Donation methods
- Current campaigns
- Mobile money/bank details
- Planned giving info
- Financial transparency

---

**TIP:** Start from the top (Critical items) and work your way down. The website will function with placeholder content, but updating contact information should be your first priority for visitor communication.

**REMEMBER:** After making changes, test the website on both desktop and mobile devices to ensure everything displays correctly!
