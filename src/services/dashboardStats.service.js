import connectDB from "@/lib/connectDB";
import ContactEnquiry from "@/models/Enquries/ContactEnquiry";
import EnquiryPage from "@/models/Enquries/EnquiryPage";
import PackageEnquiry from "@/models/Enquries/PackageEnquiry";
import RoomEnquiry from "@/models/Enquries/RoomEnquriy";

async function getCounts(Model) {
  const [total, pending] = await Promise.all([
    Model.countDocuments(),
    Model.countDocuments({ status: "Pending" }),
  ]);

  return { total, pending };
}

export async function getDashboardEnquiryStats() {
  try {
    await connectDB();

    const [contact, enquiryPage, packageEnquiry, room] = await Promise.all([
      getCounts(ContactEnquiry),
      getCounts(EnquiryPage),
      getCounts(PackageEnquiry),
      getCounts(RoomEnquiry),
    ]);

    const totalEnquiries =
      contact.total + enquiryPage.total + packageEnquiry.total + room.total;
    const totalPending =
      contact.pending +
      enquiryPage.pending +
      packageEnquiry.pending +
      room.pending;

    return {
      contact,
      enquiryPage,
      packageEnquiry,
      room,
      totalEnquiries,
      totalPending,
    };
  } catch (error) {
    console.error("Failed to load dashboard enquiry stats:", error);
    return {
      contact: { total: 0, pending: 0 },
      enquiryPage: { total: 0, pending: 0 },
      packageEnquiry: { total: 0, pending: 0 },
      room: { total: 0, pending: 0 },
      totalEnquiries: 0,
      totalPending: 0,
    };
  }
}
