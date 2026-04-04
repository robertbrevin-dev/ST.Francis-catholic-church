# Livestream Management System

This document describes the livestream management functionality for the St. Francis Cheptarit Catholic Church website.

## Overview

The livestream system allows administrators to configure and manage live streaming URLs and meeting details that are displayed on the public livestream page. The system supports YouTube, Facebook Live, and Zoom platforms.

## Features

### Admin Livestream Management (`/admin/livestream`)
- **YouTube Configuration**: Set YouTube live stream URLs
- **Facebook Configuration**: Configure Facebook Live URLs  
- **Zoom Configuration**: Manage Zoom meeting URLs, IDs, and passcodes
- **Real-time Updates**: Changes are immediately reflected on the public page
- **Link Testing**: Admin can test configured links before saving
- **Responsive Design**: Works on desktop and mobile devices

### Public Livestream Page (`/livestream`)
- **Dynamic Loading**: Fetches streaming configuration from database
- **Platform Cards**: Displays available streaming platforms with branded styling
- **Meeting Details**: Shows Zoom meeting ID and passcode when configured
- **Loading States**: Professional loading animation while fetching data
- **Fallback Values**: Uses default placeholders if no configuration exists

## Database Schema

### `livestream_config` Table

```sql
CREATE TABLE livestream_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  youtube_url TEXT,
  facebook_url TEXT,
  zoom_meeting_url TEXT,
  zoom_meeting_id TEXT,
  zoom_passcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Security Policies
- **Read Access**: Anyone can view the livestream configuration
- **Write Access**: Only authenticated admin users can update configuration
- **Row Level Security**: Enabled for all operations

## File Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── livestream.tsx          # Public livestream page
│   │   └── admin/
│   │       └── livestream.tsx      # Admin management interface
├── lib/
│   ├── supabase.ts                 # Supabase client configuration
│   └── auth.ts                     # Authentication utilities
└── database/
    └── livestream_config.sql       # Database schema and policies
```

## Setup Instructions

### 1. Database Setup

Execute the SQL file in your Supabase project:

```sql
-- Run the contents of database/livestream_config.sql
```

This will:
- Create the `livestream_config` table
- Set up Row Level Security policies
- Create triggers for automatic timestamp updates
- Insert default configuration

### 2. Environment Configuration

Ensure your Supabase credentials are properly configured in your environment:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Admin Access

Only users with admin roles can access the livestream management:

- `father_2`
- `parish_priest`
- `parish_secretary`
- `treasurer`
- `parish_it_officer`
- `parish_it_officer_2`

## Usage

### For Administrators

1. **Access the Admin Panel**: Navigate to `/admin` and log in
2. **Open Livestream Management**: Click on the "Livestream" card
3. **Configure URLs**:
   - Enter YouTube stream URL in the format: `https://youtube.com/watch?v=...`
   - Enter Facebook Live URL in the format: `https://facebook.com/...`
   - Enter Zoom meeting URL, ID, and passcode
4. **Test Links**: Click the "Test link" links to verify URLs work correctly
5. **Save Configuration**: Click "Save Configuration" to update the public page

### For Parishioners

1. **Visit Livestream Page**: Navigate to `/livestream`
2. **Choose Platform**: Click on your preferred streaming platform
3. **Join Service**: You'll be redirected to the live stream or meeting

## Technical Details

### Data Flow

1. **Admin saves configuration** → Supabase database
2. **Public page loads** → Fetches latest configuration from database
3. **User clicks platform link** → Redirected to configured URL

### Error Handling

- **Database Errors**: Graceful fallback to default values
- **Invalid URLs**: Still allows saving (admin responsibility)
- **Network Issues**: Shows loading state with retry capability

### Performance

- **Caching**: Configuration is cached in component state
- **Optimistic Updates**: UI updates immediately on save
- **Minimal Queries**: Single query fetches all configuration data

## Security Considerations

- **Authentication**: Admin actions require authenticated admin users
- **Input Validation**: URLs are validated as proper URL format
- **XSS Protection**: All content is properly escaped
- **RLS Policies**: Database access controlled by Supabase policies

## Troubleshooting

### Common Issues

1. **Links not updating**: Clear browser cache and refresh
2. **Admin access denied**: Verify user has admin role in `admin_profiles` table
3. **Database errors**: Check Supabase logs and ensure RLS policies are correct
4. **Missing configuration**: Run the SQL setup script to create default config

### Debug Mode

To enable debug logging, check the browser console for:
- `Error loading stream config:` messages
- Supabase query errors
- Network request failures

## Future Enhancements

Potential improvements for the livestream system:

- **Live Status Indicators**: Show when streams are currently active
- **Schedule Integration**: Connect to events system for automatic stream scheduling
- **Multiple Stream Support**: Support for backup streams and different quality options
- **Analytics**: Track viewer counts and platform usage
- **Mobile App Integration**: Deep linking for mobile streaming apps

## Support

For technical support or questions about the livestream system:

1. Check this documentation first
2. Review browser console for error messages
3. Verify Supabase configuration and policies
4. Contact the parish IT officer for assistance
