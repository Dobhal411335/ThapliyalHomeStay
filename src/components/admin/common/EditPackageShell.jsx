'use client'

import Sidebar from "@/components/admin/common/Sidebar"
import { usePackage } from "@/components/admin/context/PackageContext"

const EditPackageShell = ({ children }) => {
  const packages = usePackage()

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 md:py-12">
        <header className="mb-8 md:mb-10">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Manage package
          </p>
          <h1 className="mt-2 font-heading text-3xl text-heading md:text-4xl">
            Edit Package:{" "}
            <span className="text-primary">{packages?.packageName || "Untitled"}</span>
          </h1>
        </header>

        <div className="flex flex-col gap-8 xl:flex-row xl:gap-10">
          <Sidebar id={packages?._id} slug={packages?.slug} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default EditPackageShell
