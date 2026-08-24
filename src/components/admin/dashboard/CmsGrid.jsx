import Link from "next/link";
import { DashboardCard } from "@/components/admin/common/DashboardCard";
import { adminNavSections } from "@/components/admin/layout/adminNavSections";

export function CmsGrid() {
  return (
    <div className="flex flex-col gap-8">
      {adminNavSections.map((section) => {
        const SectionIcon = section.icon;

        return (
          <DashboardCard
            key={section.id}
            title={section.label}
            description={`${section.items.length} pages`}
            action={
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/8">
                <SectionIcon className="size-4 text-primary" aria-hidden="true" />
              </div>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.items.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3.5 transition-all hover:border-primary/30 hover:bg-primary/3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/12">
                      <ItemIcon
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-ui text-sm font-medium text-heading group-hover:text-primary">
                        {item.label}
                      </p>
                      <p className="mt-0.5 font-ui text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}
