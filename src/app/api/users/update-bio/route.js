import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function PUT(req) {
  try {
    const { userId, bio } = await req.json();

    if (!userId || typeof bio !== "string") {
      return new Response(
        JSON.stringify({ message: "Invalid data. User ID and bio are required." }),
        { status: 400 }
      );
    }

    await connectMongo();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Bio updated successfully.", bio: updatedUser.bio }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bio:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 }
    );
  }
}