import {
  clearPhilosophyBannerImage,
  getPhilosophyBanner,
  updatePhilosophyBannerImage,
} from "@/services/philosophyBanner.service";

export const GET = async () => {
  try {
    const data = await getPhilosophyBanner();
    return Response.json(
      {
        success: true,
        message: "Philosophy banner fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch philosophy banner",
        data: null,
      },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { field, image } = body;

    const data = await updatePhilosophyBannerImage(field, image);
    return Response.json(
      {
        success: true,
        message: "Image saved successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to save image",
        data: null,
      },
      { status: 400 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const body = await req.json();
    const { field } = body;

    const data = await clearPhilosophyBannerImage(field);
    return Response.json(
      {
        success: true,
        message: "Image removed successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to remove image",
        data: null,
      },
      { status: 400 }
    );
  }
};
