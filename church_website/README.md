# St. Francis Cheptarit Catholic Parish — Website

A professional React + Vite + TailwindCSS website for St. Francis Cheptarit Catholic Parish, Mosoriot, Nandi County, Kenya.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Structure

```
src/
  app/
    pages/          ← All website pages
    components/     ← Header, Footer, Layout, UI components
  styles/           ← theme.css (colours), tailwind.css
public/
  images/
    logo.jpeg       ← Parish logo (St. Francis)
    church.jpg      ← Church building photo
```

## ✏️ What to Update

### 1. Contact Details — update in each file:
- `src/app/components/header.tsx` — `CHURCH_PHONE`, `WHATSAPP_NUMBER`
- `src/app/components/footer.tsx` — phone, email, social media links
- `src/app/pages/home.tsx` — same
- `src/app/pages/contact.tsx` — same
- `src/app/pages/giving.tsx` — same

### 2. Announcements — update regularly:
- `src/app/pages/announcements.tsx` — `LIVE_ANNOUNCEMENTS`, `PINNED_ANNOUNCEMENTS`, `ANNOUNCEMENTS` arrays
- `src/app/pages/home.tsx` — `LIVE_ANNOUNCEMENTS` array (ticker at top)

### 3. Events — update:
- `src/app/pages/events.tsx` — `EVENTS` array for new/changed events

### 4. M-PESA Details (already set):
- Paybill: **247247**
- Account: **341370**

## 🎨 Theme Colors
- Primary Green: `#1b6b35`
- Dark Green: `#0d3320`
- Light Green: `#2d8a48`
- Gold/Yellow: `#c8a84b`

## 📞 Contact Numbers to Replace
Search for `+254 700 000 000` and `254700000000` in all files and replace with the actual parish phone number.

## 📧 WhatsApp Button
The WhatsApp floating button is in `src/app/components/header.tsx`. Update `WHATSAPP_NUMBER` with the real number (digits only, no + or spaces, with country code e.g. `254712345678`).

## Pages Included
- `/` — Home (live announcements, hero with church photo & logo, events, giving)
- `/about` — About the Parish, St. Francis, Diocese of Kapsabet
- `/mass-times` — Full Mass Schedule
- `/ministries` — CMA, CWA, Youth, PMC, CSA, Choir, Altar Servers, SVdP, etc.
- `/services` — All Sacraments & Pastoral Services
- `/events` — Parish Calendar & Events
- `/announcements` — Live Announcements + Interactive Message Board
- `/contact` — Contact Form + WhatsApp + Emergency pastoral info
- `/giving` — M-PESA Sadaka (Paybill 247247, Account 341370) + Ways to Give
