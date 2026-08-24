import AddPackage from "@/components/admin/pages/AddPackage"
const page = async ({ params }) => {
    const { id } = await params

    return (
        <AddPackage id={id} />

    )
}

export default page
