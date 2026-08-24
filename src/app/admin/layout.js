export const metadata = {
  title: {
    default: "ThapliyalHomeStay CMS",
    template: "%s | ThapliyalHomeStay CMS",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
