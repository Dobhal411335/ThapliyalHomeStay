'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = ({ id, slug }) => {
    const pathname = usePathname()
    return (
        <>
            <Link href={`/admin/editPackage/${id}`} className='w-52'>
                <button className={`${pathname.includes(`/admin/editPackage/${id}`) ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Basic Detail</button>
            </Link>
            <Link href={`/admin/editPackage/add-info/${id}`} className='w-52'>
                <button className={`${pathname.includes('/add-info') ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Add Info</button>
            </Link>
            <Link href={`/admin/editPackage/add-gallery/${id}`} className='w-52'>
                <button className={`${pathname.includes('/add-gallery') ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Add Gallery</button>
            </Link>
            <Link href={`/admin/editPackage/add-hotels/${id}`} className='w-52'>
                <button className={`${pathname.includes('/add-hotels') ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Add Hotels</button>
            </Link>
            <Link href={`/admin/editPackage/summary/${id}`} className='w-52'>
                <button className={`${pathname.includes('/summary') ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Summary</button>
            </Link>
            <Link href={`/admin/editPackage/include-package/${id}`} className='w-52'>
                <button className={`${pathname.includes('/include-package') ? 'bg-blue-600 text-white' : ''} bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>Include Package</button>
            </Link>
            <Link href={`/package/${slug}`} className='w-52'>
                <button className={` bg-blue-100 border-2 p-3 rounded-lg w-full border-blue-600`}>View Final Detail</button>
            </Link>
        </>
    )
}

export default Sidebar
