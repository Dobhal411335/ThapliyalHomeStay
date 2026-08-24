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

const ResponsiveNavbar = ({ sections = [] }) => {
  const visibleSections = sections
    .filter((section) => section?.active)
    .sort((left, right) => (left.order || 0) - (right.order || 0));

  return (
    <NavigationMenu.Root className="hidden relative z-[99] isolate lg:flex w-full justify-end ">
      <NavigationMenu.List className="relative z-[99] flex items-center justify-center gap-1 rounded-md px-1 py-1">
        <NavigationMenu.Item>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] text-black transition-colors hover:bg-surface text-nowrap hover:underline"
          >
            Home
          </Link>
        </NavigationMenu.Item>

        {visibleSections.map((section) => {
          const hasSubSections = Array.isArray(section.subSections) && section.subSections.some((item) => item?.active);
          const sortedSubSections = (section.subSections || [])
            .filter((item) => item?.active)
            .sort((left, right) => (left.order || 0) - (right.order || 0));

          if (!hasSubSections) {
            return (
              <NavigationMenu.Item key={section._id || section.title}>
                <Link
                  href={section.url || "#"}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] text-black transition-colors hover:bg-surface text-nowrap hover:underline"
                >
                  {section.title}
                </Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={section._id || section.title} className="relative flex justify-center">
              <NavigationMenu.Trigger className="flex items-center gap-2 rounded-md px-4 py-2 text-[14px] text-black transition-colors hover:bg-surface text-nowrap data-[state=open]:bg-surface hover:underline">
                {section.title}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content aschild>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-full mt-3 -translate-x-1/2 min-w-[240px] w-max rounded-xl border border-border bg-background p-2 shadow-2xl"
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
                          className="block rounded-md px-4 py-3 text-[14px] text-black hover:bg-primary transition-colors hover:text-white"
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
            className="flex items-center gap-2 rounded-full bg-[#2c2f2c] px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:opacity-90 text-nowrap"
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
                setOpenSectionId((current) => (current === sectionId ? null : sectionId))
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
        className="mt-3 inline-flex w-fit items-center justify-center rounded-full bg-[#2c2f2c] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
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
  const company = useCompanyBasicInfo();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/navbar-sections');
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
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="relative z-50 bg-surface">
        <TopAdvertisementMarquee />
        <div className="container flex h-16 md:h-20 items-center justify-between md:px-10 px-2">
          <Logo
            name={company?.companyName}
            imageSrc={company?.mainLogo?.url}
          />
          <div className="flex items-center gap-8">
            <ResponsiveNavbar sections={sections} />
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="flex size-10 items-center justify-center rounded-md text-heading transition-colors hover:bg-surface lg:hidden"
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
            transition={{ duration: 0.2, ease: menuEase }}
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
            transition={{ duration: 0.3, ease: menuEase }}
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-b border-t border-border bg-surface px-6 py-6 shadow-lg lg:hidden"
          >
            <MobileNav sections={sections} onNavigate={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
