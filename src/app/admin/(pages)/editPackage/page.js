"use client"

import Sidebar from "@/components/admin/common/Sidebar";
import { usePackage } from "@/components/admin/context/PackageContext";
import EditPackage from "@/components/admin/pages/EditPackage";

const EditPackagePage = () => {
	const packages = usePackage();

	return (
		<div className="w-full">
			<h1 className="text-4xl px-12 font-semibold">
				Edit Package: <span className="font-bold text-blue-600">{packages?.packageName}</span>
			</h1>
			<div className='flex xl:flex-row flex-col gap-8 xl:gap-32 p-12'>
				<div className="flex xl:flex-col flex-wrap gap-2 my-20 font-semibold items-center">
					<Sidebar id={packages?._id} slug={packages?.slug} />
				</div>
				<EditPackage />
			</div>
		</div>
	)
}

export default EditPackagePage
