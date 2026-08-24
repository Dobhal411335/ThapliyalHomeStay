import EditWebpages from "@/components/admin/pages/EditWebpages"

const page = async ({ params }) => {
    const { id } = await params;
    return (
        <EditWebpages activityId={id} />
    )
}

export default page
