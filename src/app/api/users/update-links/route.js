import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function PUT(req) {
  try {
    await connectMongo();

    const { userId, links } = await req.json();

    if (!userId || !Array.isArray(links) || links.length > 4) {
      return new Response(
        JSON.stringify({ message: "Invalid data. You can only add up to 4 links." }),
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { links },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found. Unable to update links." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Links updated successfully.", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating links:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}