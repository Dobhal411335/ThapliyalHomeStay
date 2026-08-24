/* ── Admin sidebar navigation ────────────────────── */
export const adminNavigation = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "Website",
    items: [
      { label: "Hero", href: "/admin/hero", icon: "Layers" },
      { label: "About", href: "/admin/about", icon: "Info" },
      { label: "Retreat Packages", href: "/admin/packages", icon: "Package" },
      { label: "Gallery", href: "/admin/gallery", icon: "Images" },
      { label: "Testimonials", href: "/admin/create_testimonials", icon: "Star" },
      { label: "Contact", href: "/admin/contact-info", icon: "Mail" },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: "MessageSquare" },
    ],
  },
  {
    group: "Admin",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
];
