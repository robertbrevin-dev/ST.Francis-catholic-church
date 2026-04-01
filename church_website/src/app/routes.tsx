import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { MassTimes } from "./pages/mass-times";
import { Ministries } from "./pages/ministries";
import { Services } from "./pages/services";
import { Events } from "./pages/events";
import { Announcements } from "./pages/announcements";
import { Livestream } from "./pages/livestream";
import { Contact } from "./pages/contact";
import { Giving } from "./pages/giving";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
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
    ],
  },
]);
