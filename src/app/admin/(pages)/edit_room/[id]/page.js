import EditRoom from "@/components/admin/pages/EditRoom";
const EditRoomPage = async ({ params }) => {
  const { id } = await params;
  return <EditRoom roomId={id} />;
};

export default EditRoomPage;
