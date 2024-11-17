import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function DELETE(req) {
  try {
    const { userId, linkId } = await req.json();

    if (!userId || !linkId) {
      return new Response(
        JSON.stringify({ message: "User ID and Link ID are required." }),
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    // Remove the link with the given linkId
    user.links = user.links.filter((link) => link._id.toString() !== linkId);
    await user.save();

    return new Response(
      JSON.stringify({ message: "Link deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting link:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}