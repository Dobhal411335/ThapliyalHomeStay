"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion, AnimatePresence } from "framer-motion";

import { Logo } from "@/components/common/Logo";
import TopAdvertisementMarquee from "@/components/admin/pages/TopAdvertisementMarquee";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";
import { cn } from "@/lib/utils";

const SCROLL_HIDE_THRESHOLD = 40;
const navTransition =
  "transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

const ResponsiveNavbar = ({ sections = [], scrolled = false }) => {
  const visibleSections = sections
    .filter((section) => section?.active)
    .sort((left, right) => (left.order || 0) - (right.order || 0));

  const linkClass = cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-[14px] text-nowrap hover:underline",
    navTransition,
    scrolled
      ? "text-white hover:bg-white/10"
      : "text-black hover:bg-surface",
  );

  const triggerClass = cn(
    "flex items-center gap-2 rounded-md px-4 py-2 text-[14px] text-nowrap hover:underline",
    navTransition,
    scrolled
      ? "text-white hover:bg-white/10 data-[state=open]:bg-white/10"
      : "text-black hover:bg-surface data-[state=open]:bg-surface",
  );

  return (
    <NavigationMenu.Root className="relative z-[99] isolate hidden w-full justify-end lg:flex">
      <NavigationMenu.List className="relative z-[99] flex items-center justify-center gap-1 rounded-md px-1 py-1">
        <NavigationMenu.Item>
          <Link href="/" className={linkClass}>
            Home
          </Link>
        </NavigationMenu.Item>

        {visibleSections.map((section) => {
          const hasSubSections =
            Array.isArray(section.subSections) &&
            section.subSections.some((item) => item?.active);
          const sortedSubSections = (section.subSections || [])
            .filter((item) => item?.active)
            .sort((left, right) => (left.order || 0) - (right.order || 0));

          if (!hasSubSections) {
            return (
              <NavigationMenu.Item key={section._id || section.title}>
                <Link href={section.url || "#"} className={linkClass}>
                  {section.title}
                </Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item
              key={section._id || section.title}
              className="relative flex justify-center"
            >
              <NavigationMenu.Trigger className={triggerClass}>
                {section.title}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute top-full left-1/2 mt-3 w-max min-w-[240px] -translate-x-1/2 rounded-xl border border-border bg-background p-2 shadow-2xl"
                >
                  <div className="grid gap-1">
                    {sortedSubSections.map((subSection, index) => (
                      <motion.div
                        key={subSection._id || subSection.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.2,
                        }}
                      >
                        <Link
                          href={subSection.url || "#"}
                          className="block rounded-md px-4 py-3 text-[14px] text-black transition-colors hover:bg-primary hover:text-white"
                        >
                          {subSection.title}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}

        <NavigationMenu.Item className="ml-2">
          <Link
            href="/contact"
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-medium text-nowrap",
              navTransition,
              scrolled
                ? "border border-white/40 bg-white/10 text-white hover:bg-white/20"
                : "border border-transparent bg-primary text-white hover:opacity-90",
            )}
          >
            Reserve a stay
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

const menuEase = [0.4, 0, 0.2, 1];

function getActiveSubSections(section) {
  return (section.subSections || [])
    .filter((item) => item?.active)
    .sort((left, right) => (left.order || 0) - (right.order || 0));
}

function MobileNav({ sections = [], onNavigate }) {
  const [openSectionId, setOpenSectionId] = useState(null);

  const visibleSections = sections
    .filter((section) => section?.active)
    .sort((left, right) => (left.order || 0) - (right.order || 0));

  return (
    <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
      <Link
        href="/"
        className="rounded-md px-1 py-3 font-body text-sm font-medium text-foreground hover:text-primary"
        onClick={onNavigate}
      >
        Home
      </Link>

      {visibleSections.map((section) => {
        const sectionId = section._id || section.title;
        const subSections = getActiveSubSections(section);
        const hasSubSections = subSections.length > 0;

        if (!hasSubSections) {
          return (
            <Link
              key={sectionId}
              href={section.url || "#"}
              className="rounded-md px-1 py-3 font-body text-sm font-medium text-foreground hover:text-primary"
              onClick={onNavigate}
            >
              {section.title}
            </Link>
          );
        }

        const isOpen = openSectionId === sectionId;

        return (
          <div key={sectionId}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-md px-1 py-3 text-left font-body text-sm font-medium text-foreground transition-colors hover:text-primary"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenSectionId((current) =>
                  current === sectionId ? null : sectionId,
                )
              }
            >
              {section.title}
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted transition-transform duration-(--duration-fast) ease-(--ease-smooth)",
                  isOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key={sectionId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: menuEase }}
                  className="overflow-hidden"
                >
                  <div className="mb-2 flex flex-col gap-1 border-l border-border pl-4">
                    {subSections.map((sub, index) => (
                      <motion.div
                        key={sub._id || sub.title}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.04,
                          duration: 0.2,
                          ease: menuEase,
                        }}
                      >
                        <Link
                          href={sub.url || "#"}
                          className="block rounded-md py-2.5 font-body text-sm text-foreground hover:text-primary"
                          onClick={onNavigate}
                        >
                          {sub.title}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      <Link
        href="/contact"
        className="mt-3 inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        onClick={onNavigate}
      >
        Reserve a stay
      </Link>
    </nav>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  const company = useCompanyBasicInfo();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("/api/navbar-sections");
        if (response.ok) {
          const data = await response.json();
          setSections(data);
        }
      } catch (error) {
        console.error("Failed to fetch navbar sections:", error);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    let frame = 0;
    lastScrollY.current = window.scrollY;

    const updateScrollState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const prevY = lastScrollY.current;
        const delta = y - prevY;

        if (y <= SCROLL_HIDE_THRESHOLD) {
          setNavHidden(false);
          setScrolled(false);
        } else if (delta > 6) {
          setNavHidden(true);
          setScrolled(false);
          setOpen(false);
        } else if (delta < -6) {
          setNavHidden(false);
          setScrolled(true);
        }

        lastScrollY.current = y;
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return undefined;
 
    const syncHeight = () => {
      setHeaderHeight(node.offsetHeight || 80);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrolled, open, navHidden]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{
          y: navHidden ? "-110%" : "0%",
          boxShadow: scrolled
            ? "0 10px 30px rgba(0,0,0,0.18)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.45, ease: menuEase }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b bg-surface",
          navTransition,
          scrolled ? "border-white/10" : "border-border",
        )}
      >
        {/* Pattern layer — fades in on scroll for a smooth crossfade */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat",
            navTransition,
            scrolled ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: "url('/bg-pattern-3.jpg')" }}
        />

        <div className="relative z-50 w-full">
          <TopAdvertisementMarquee />
          <div className="container flex h-16 items-center justify-between px-2 md:h-20 md:px-10">
            <Logo
              name={company?.companyName}
              imageSrc={company?.mainLogo?.url}
              tone={scrolled ? "light" : "dark"}
            />
            <div className="flex items-center gap-8">
              <ResponsiveNavbar sections={sections} scrolled={scrolled} />
            </div>

            <button
              ref={toggleRef}
              type="button"
              className={cn(
                "flex size-10 items-center justify-center rounded-md lg:hidden",
                navTransition,
                scrolled
                  ? "text-white hover:bg-white/10"
                  : "text-heading hover:bg-surface",
              )}
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.button
              key="mobile-nav-overlay"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: menuEase }}
              className="fixed inset-0 z-40 bg-heading/20 lg:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="mobile-nav-panel"
              ref={menuRef}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: menuEase }}
              className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-b border-t border-border bg-surface px-6 py-6 shadow-lg lg:hidden"
            >
              <MobileNav
                sections={sections}
                onNavigate={() => setOpen(false)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/* Spacer so fixed navbar does not cover page content */}
      <div aria-hidden="true" style={{ height: headerHeight }} />
    </>
  );
}
