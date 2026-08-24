'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  Info,
  Images,
  Hotel,
  List,
  Package,
  Map,
  Car,
  ExternalLink,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Basic Detail",
    href: (id) => `/admin/editPackage/${id}`,
    icon: FileText,
    isActive: (pathname, id) =>
      pathname === `/admin/editPackage/${id}` || pathname === `/admin/editPackage/${id}/`,
  },
  {
    label: "Add Info",
    href: (id) => `/admin/editPackage/add-info/${id}`,
    icon: Info,
    isActive: (pathname) => pathname.includes("/add-info"),
  },
  {
    label: "Add Gallery",
    href: (id) => `/admin/editPackage/add-gallery/${id}`,
    icon: Images,
    isActive: (pathname) => pathname.includes("/add-gallery"),
  },
  {
    label: "Add Hotels",
    href: (id) => `/admin/editPackage/add-hotels/${id}`,
    icon: Hotel,
    isActive: (pathname) => pathname.includes("/add-hotels"),
  },
  {
    label: "Summary",
    href: (id) => `/admin/editPackage/summary/${id}`,
    icon: List,
    isActive: (pathname) => pathname.includes("/summary"),
  },
  {
    label: "Include Package",
    href: (id) => `/admin/editPackage/include-package/${id}`,
    icon: Package,
    isActive: (pathname) => pathname.includes("/include-package"),
  },  
]

const Sidebar = ({ id, slug }) => {
  const pathname = usePathname()

  return (
    <aside className="xl:sticky xl:top-20 w-full xl:w-56 shrink-0">
      <nav
        aria-label="Edit package sections"
        className="rounded-[var(--radius-card)] bg-white p-3 ring-1 ring-border/50"
      > 
        <p className="mb-3 px-2 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Package sections
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.isActive(pathname, id)
            return (
              <li key={item.label}>
                <Link
                  href={item.href(id)}
                  className={cn(
                    buttonVariants({
                      variant: active ? "default" : "ghost",
                      size: "sm",
                    }),
                    "w-full justify-start gap-2 font-ui text-sm",
                    !active && "text-heading hover:text-heading"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <Separator className="my-3" />

        <Link
          href={`/package/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full justify-start gap-2 font-ui text-sm"
          )}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          View Final Detail
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
