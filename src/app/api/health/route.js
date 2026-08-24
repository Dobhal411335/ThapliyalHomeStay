export async function GET() {
  try {
    return Response.json({
      success: true,
      message: "Application running",
      data: null,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Health check failed",
        data: null,
      },
      { status: 500 }
    );
  }
}
