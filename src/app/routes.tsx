
import React from 'react'
import { createBrowserRouter } from 'react-router'
import { Layout } from './components/layout'

/* Public Pages */
import { Home } from './pages/home'
import { About } from './pages/about'
import { MassTimes } from './pages/mass-times'
import { Ministries } from './pages/ministries'
import { Services } from './pages/services'
import { Events } from './pages/events'
import { Announcements } from './pages/announcements'
import { Livestream } from './pages/livestream'
import { Contact } from './pages/contact'
import { Giving } from './pages/giving'

/* Admin Pages */
import { AdminLogin } from './pages/admin/login'
import { AdminDashboard } from './pages/admin/dashboard'
import { AdminAnnouncements } from './pages/admin/announcements'
import { AdminMassTimes } from './pages/admin/mass-times'
import { AdminConfessions } from './pages/admin/confessions'
import { AdminEvents } from './pages/admin/events'
import { AdminGiving } from './pages/admin/giving'
import { AdminLivestream } from './pages/admin/livestream'
import { AdminSettings } from './pages/admin/settings'

export const router = createBrowserRouter([

  /* Public Routes */

  {
    path: '/',
    Component: Layout,
    children: [

      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'mass-times', Component: MassTimes },
      { path: 'ministries', Component: Ministries },
      { path: 'services', Component: Services },
      { path: 'events', Component: Events },
      { path: 'announcements', Component: Announcements },
      { path: 'livestream', Component: Livestream },
      { path: 'contact', Component: Contact },
      { path: 'giving', Component: Giving }

    ]
  },

  /* Admin Routes */

  { path: '/admin', Component: AdminLogin },

  { path: '/admin/dashboard', Component: AdminDashboard },

  { path: '/admin/announcements', Component: AdminAnnouncements },
  { path: '/admin/mass-times', Component: AdminMassTimes },
  { path: '/admin/confessions', Component: AdminConfessions },
  { path: '/admin/events', Component: AdminEvents },
  { path: '/admin/giving', Component: AdminGiving },
  { path: '/admin/livestream', Component: AdminLivestream },
  { path: '/admin/settings', Component: AdminSettings }

])
