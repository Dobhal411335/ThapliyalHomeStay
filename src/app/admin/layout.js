export const metadata = {
  title: {
    default: "Thapliyal Home Stay CMS",
    template: "%s | Thapliyal Home Stay CMS",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
