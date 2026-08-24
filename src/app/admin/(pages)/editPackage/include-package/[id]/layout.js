import '@/app/globals.css'
import { PackageProvider } from '@/components/admin/context/PackageContext'
import connectDB from '@/lib/connectDB'
import { serializePackage } from '@/lib/serializePackage'
import Package from '@/models/Admin/Package'

export default async function RootLayout({ children, params }) {
  const { id } = await params
  await connectDB()

  const packages = serializePackage(await Package.findById(id).lean())

  return (
    <PackageProvider packages={packages}>
      {children}
    </PackageProvider>
  )
}
