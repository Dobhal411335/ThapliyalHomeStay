import {
  LayoutDashboard,
  Package,
  Building2,
  Navigation,
  Share2,
  FileStack,
  Inbox,
  PackageSearch,
  MenuIcon,
  Boxes,
  Image as ImageIcon,
} from "lucide-react";

export const adminNavSections = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        label: "Company Basic Info",
        href: "/admin/company_basic_information",
        icon: Building2,
      },
      {
        label: "Manage Navbar",
        href: "/admin/navbar_section",
        icon: Navigation,
      },
      {
        label: "Social Media Post",
        href: "/admin/insta_fb_post",
        icon: Share2,
      },
      {
        label: "Create Webpages",
        href: "/admin/create_webpage",
        icon: FileStack,
      }, {
        label: "Manage Webpage",
        href: "/admin/manage_webpage",
        icon: FileStack,
      },

      {
        label: "Room Enquiry Page",
        href: "/admin/room_enquiries",
        icon: Inbox,
      },
      {
        label: "Package Enquiry",
        href: "/admin/enquiries/packages",
        icon: PackageSearch,
      },
      {
        label: "Enquiry Page",
        href: "/admin/enquiry_page",
        icon: Inbox,
      },
      {
        label: "Contact Us Page",
        href: "/admin/contact_us",
        icon: PackageSearch,
      },
    ],
  },
  {
    id: "manage_banners",
    label: "Manage Banners",
    icon: ImageIcon,
    items: [
      {
        label: "Top Advertisment Banner",
        href: "/admin/top_advertisment_banner",
        icon: ImageIcon,
      },
      {
        label: "Promotional Banner",
        href: "/admin/promotional_banner",
        icon: ImageIcon,
      },
      {
        label: "Manage Banner",
        href: "/admin/change_banner_image",
        icon: ImageIcon,
      },
      {
        label: "Featured Offered Banner",
        href: "/admin/featured_offered_banner",
        icon: ImageIcon,
      },
      {
        label: "Offer Details",
        href: "/admin/offer_details",
        icon: ImageIcon,
      },
      {
        label: "Manage Featured Product",
        href: "/admin/manage_featured_packages",
        icon: ImageIcon,
      },
      {
        label: "Category Advertisment",
        href: "/admin/category_advertisment",
        icon: ImageIcon,
      },
      {
        label: "PopUp Banner",
        href: "/admin/popup_banner",
        icon: ImageIcon,
      },
      {
        label: "Consultancy Banner",
        href: "/admin/consultancy_banner",
        icon: ImageIcon,
      },
      {
        label: "Banner Section 1st",
        href: "/admin/banner_section_1st",
        icon: ImageIcon,
      },
      {
        label: "Banner Section 2nd",
        href: "/admin/banner_section_2nd",
        icon: ImageIcon,
      },
      {
        label: "Banner Section 3rd",
        href: "/admin/banner_section_3rd",
        icon: ImageIcon,
      },
    ],
  },
  {
    id: "sub-dashboard",
    label: "Sub-Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        label: "Manage Menu Section",
        href: "/admin/manage_menu",
        icon: MenuIcon,
      },
      {
        label: "Manage Packages",
        href: "/admin/manage_packages_category",
        icon: Boxes,
      },
      {
        label: "Manage Hotels",
        href: "/admin/manage_hotels",
        icon: Boxes,
      },
      {
        label: "Manage Rooms",
        href: "/admin/create_room",
        icon: Boxes,
      },
    ],
  },
  {
    id: "Manage Reviews",
    label: "Manage Reviews",
    icon: Package,
    items: [
      {
        label: "Create Testimonials",
        href: "/admin/create_testimonials",
        icon: Package,
      },
      {
        label: "Approve or Reject Reviews",
        href: "/admin/manage_reviews",
        icon: Package,
      },
    ],
  },
];
