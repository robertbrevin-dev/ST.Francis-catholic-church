# Quick Start Guide - St. Francis Church Website

## Getting Started

Your church website is ready to use! Here's what you need to know:

## What's Already Done ✅

- ✅ 7 Complete pages (Home, About, Mass Times, Ministries, Events, Contact, Giving)
- ✅ Responsive design (works on mobile, tablet, and desktop)
- ✅ Green theme for the church
- ✅ Navigation header with mobile menu
- ✅ Footer with contact information
- ✅ All UI components from Shadcn
- ✅ React Router for page navigation

## Immediate Customizations Needed

### 1. Contact Information (PRIORITY)
Replace placeholder contact details with real information:

**Files to edit:**
- `/src/app/components/footer.tsx` - Lines with phone, email, address
- `/src/app/pages/contact.tsx` - All contact information sections

**Replace:**
- Phone: `+254 700 000 000` → Your actual phone number
- Email: `info@stfrancischeptarit.org` → Your actual email
- Emergency: `+254 700 000 001` → Your actual emergency line

### 2. Mass Times
Update with your actual schedule:

**File:** `/src/app/pages/mass-times.tsx`

Find the arrays:
- `weekdayMasses` - Update times and languages
- `sundayMasses` - Update times and languages
- `specialServices` - Update confession times, adoration schedule

### 3. Clergy Information
Add your actual priests:

**File:** `/src/app/pages/about.tsx`

Update the `clergy` array (around line 6) with real names and information.

### 4. Church History
Personalize your church story:

**File:** `/src/app/pages/about.tsx`

Update the "Our History" section with your actual founding date and story.

### 5. Events
Add your real upcoming events:

**File:** `/src/app/pages/events.tsx`

Update the `upcomingEvents` array with current events.

### 6. Ministry Contacts
Update ministry coordinators:

**File:** `/src/app/pages/ministries.tsx`

Update the `contact` field in each ministry with actual coordinator names.

### 7. Photos
Replace the placeholder church image:

**File:** `/src/app/pages/home.tsx`

Line with Unsplash URL - replace with your church photos.

## How to Add Your Own Images

Instead of using the Unsplash placeholder:

1. Use the `ImageWithFallback` component
2. Place your images in the public folder or use a CDN
3. Update the `src` attribute

Example:
```tsx
<ImageWithFallback
  src="/path/to/your/church-photo.jpg"
  alt="St. Francis Church"
  className="..."
/>
```

## Testing Checklist

- [ ] All phone numbers updated
- [ ] All email addresses updated
- [ ] Mass times are correct
- [ ] Clergy information is accurate
- [ ] Church history updated
- [ ] Office hours are correct
- [ ] Current events listed
- [ ] Ministry contacts updated
- [ ] Social media links added (footer)
- [ ] Test all navigation links
- [ ] Test on mobile device
- [ ] Test contact form

## Common Customizations

### Change Navigation Items
**File:** `/src/app/components/header.tsx`

Update the `navLinks` array to add/remove pages.

### Update Footer Links
**File:** `/src/app/components/footer.tsx`

Modify the Quick Links section.

### Change Theme Colors
**File:** `/src/styles/theme.css`

Modify CSS variables under `:root` for different green shades.

### Add a New Page

1. Create `/src/app/pages/your-page.tsx`
2. Add route in `/src/app/routes.tsx`
3. Add link in header and/or footer

Example:
```tsx
// In routes.tsx
{ path: "bulletin", Component: Bulletin }

// In header.tsx navLinks array
{ path: "/bulletin", label: "Bulletin" }
```

## Social Media Setup

**File:** `/src/app/components/footer.tsx`

Replace `href="#"` with actual URLs:
```tsx
<a href="https://facebook.com/yourchurch">
  <Facebook className="h-5 w-5" />
</a>
```

## Mobile Money (M-PESA) Setup

**File:** `/src/app/pages/giving.tsx`

Update the paybill number and account name:
- Replace `Paybill: 123456`
- Replace account instructions

## Google Maps Integration

**File:** `/src/app/pages/contact.tsx`

Replace the map placeholder with actual Google Maps embed:
```tsx
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>
```

## Support & Questions

Review the `PROJECT_STRUCTURE.md` file for detailed information about:
- Full feature list
- File organization
- Technology stack
- Enhancement ideas

## Ready to Deploy?

Once you've customized the content:
1. Build the project: `npm run build`
2. Deploy to your hosting service
3. Set up a custom domain
4. Configure SSL certificate

Popular hosting options:
- Vercel (recommended for React)
- Netlify
- GitHub Pages
- Traditional web hosting with static files

---

**Need Help?** All the code is well-organized and commented. Each component is self-contained and easy to modify.
