import { createBrowserRouter } from "react-router"
import { Layout } from "./components/layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Home } from "./pages/home"
import { About } from "./pages/about"
import { MassTimes } from "./pages/mass-times"
import { Ministries } from "./pages/ministries"
import { Services } from "./pages/services"
import { Events } from "./pages/events"
import { Announcements } from "./pages/announcements"
import { Livestream } from "./pages/livestream"
import { Contact } from "./pages/contact"
import { Giving } from "./pages/giving"
import { AdminLayout } from "./components/AdminLayout"
import { AdminLogin } from "./pages/admin/login"
import { AdminDashboard } from "./pages/admin/dashboard"
import { AdminAnnouncements } from "./pages/admin/announcements"
import { AdminMassTimes } from "./pages/admin/mass-times"
import { AdminConfessions } from "./pages/admin/confessions"
import { AdminEvents } from "./pages/admin/events"
import { AdminGiving } from "./pages/admin/giving"
import { AdminLivestream } from "./pages/admin/livestream"
import { AdminSettings } from "./pages/admin/settings"
import { AdminMinistries } from "./pages/admin/ministries"
import { AdminServices } from "./pages/admin/services"

export const router = createBrowserRouter([
  { path: "/", Component: Layout, children: [
    { index: true, Component: Home },
    { path: "about", Component: About },
    { path: "mass-times", Component: MassTimes },
    { path: "ministries", Component: Ministries },
    { path: "services", Component: Services },
    { path: "events", Component: Events },
    { path: "announcements", Component: Announcements },
    { path: "livestream", Component: Livestream },
    { path: "contact", Component: Contact },
    { path: "giving", Component: Giving },
  ]},
  { path: "/admin/login", Component: AdminLogin },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: "announcements", Component: AdminAnnouncements },
      { path: "mass-times", Component: AdminMassTimes },
      { path: "confessions", Component: AdminConfessions },
      { path: "events", Component: AdminEvents },
      { path: "giving", Component: AdminGiving },
      { path: "livestream", Component: AdminLivestream },
      { path: "ministries", Component: AdminMinistries },
      { path: "services", Component: AdminServices },
      { path: "settings", Component: AdminSettings },
    ],
  },
])
