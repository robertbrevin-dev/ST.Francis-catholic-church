# St. Francis Cheptarit Mosoriot - Church Website

## Project Overview
A complete Catholic church website for St. Francis Catholic Church in Cheptarit, Mosoriot with a green theme.

## Features Included

### Pages
1. **Home** (`/src/app/pages/home.tsx`)
   - Hero section with church image
   - Welcome message
   - Core values section
   - Upcoming events preview
   - Call to action sections

2. **About** (`/src/app/pages/about.tsx`)
   - Church history
   - Mission and vision
   - Clergy information
   - Sacraments offered

3. **Mass Times** (`/src/app/pages/mass-times.tsx`)
   - Sunday Mass schedule (multiple times)
   - Weekday Mass schedule
   - Special services (Confession, Adoration, Rosary)
   - Location and directions

4. **Ministries** (`/src/app/pages/ministries.tsx`)
   - 12 different ministry groups
   - Contact information for each
   - Small Christian Communities info
   - Volunteer opportunities

5. **Events** (`/src/app/pages/events.tsx`)
   - Upcoming events with details
   - Past events
   - Annual calendar of liturgical celebrations
   - Parish events throughout the year

6. **Contact** (`/src/app/pages/contact.tsx`)
   - Contact form
   - Parish office information
   - Office hours
   - Map placeholder
   - FAQ section

7. **Giving** (`/src/app/pages/giving.tsx`)
   - Multiple giving options
   - Ways to donate (cash, mobile money, bank)
   - Current fundraising campaigns
   - Planned giving information
   - Financial transparency

### Components
- **Header** - Responsive navigation with mobile menu
- **Footer** - Quick links, contact info, social media
- **Layout** - Wrapper component for all pages

## Color Theme
The website uses a green color scheme reflecting nature and growth:
- Primary: `#2d5f3f` (Forest Green)
- Secondary: `#e8f5e9` (Light Green)
- Accent: `#c8e6c9` (Pale Green)

## How to Customize

### Update Church Information
1. **Contact Details**: Edit `/src/app/components/footer.tsx` and `/src/app/pages/contact.tsx`
2. **Mass Times**: Update `/src/app/pages/mass-times.tsx`
3. **Clergy**: Modify the clergy array in `/src/app/pages/about.tsx`
4. **Events**: Add/remove events in `/src/app/pages/events.tsx`

### Add New Pages
1. Create a new file in `/src/app/pages/`
2. Add the route in `/src/app/routes.tsx`
3. Update navigation in `/src/app/components/header.tsx` and `/src/app/components/footer.tsx`

### Change Colors
Edit `/src/styles/theme.css` and update the CSS variables in the `:root` section.

### Add Images
Replace the Unsplash placeholder images in `/src/app/pages/home.tsx` with your own church photos.

## Technologies Used
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn/ui components
- Lucide React icons

## File Structure
```
/src
  /app
    /components
      /ui (Shadcn components)
      header.tsx
      footer.tsx
      layout.tsx
    /pages
      home.tsx
      about.tsx
      mass-times.tsx
      ministries.tsx
      events.tsx
      contact.tsx
      giving.tsx
    App.tsx
    routes.tsx
  /styles
    theme.css (Green color theme)
    tailwind.css
    index.css
```

## Next Steps for Enhancement

1. **Add a Blog/Newsletter section** for parish announcements
2. **Create a Photo Gallery** for church events
3. **Add Online Bulletins** (PDF downloads)
4. **Integrate Google Maps** for the location
5. **Add Social Media Integration** (actual links)
6. **Create Admin Panel** for easy content updates
7. **Add Prayer Request Form**
8. **Include Saint of the Day**
9. **Add Daily Mass Readings**
10. **Create Mobile App version**

## Contact Form Backend
The contact form currently shows a success message (toast). To make it functional:
- Connect to a backend API
- Use a service like Formspree, EmailJS, or build your own API
- Add proper form validation

## Mobile Money Integration
The giving page mentions M-PESA. To implement:
- Integrate with M-PESA API
- Add proper payment gateway
- Include receipt generation

## Notes
- All placeholder phone numbers (+254 700 000 000) should be replaced with actual numbers
- Email addresses (info@stfrancischeptarit.org) should be set up
- Social media links in footer need actual URLs
- Map section needs Google Maps API integration
