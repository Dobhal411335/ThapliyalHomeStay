import EditRoom from "@/components/admin/pages/EditRoom";

const EditRoomPage = async ({ params, searchParams }) => {
  const { id } = await params;
  const query = await searchParams;
  const type = query?.type;
  const initialMode = type === "room" || type === "hotel" ? type : null;

  return <EditRoom roomId={id} initialMode={initialMode} />;
};

export default EditRoomPage;
