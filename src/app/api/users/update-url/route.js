import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function PUT(req) {
  try {
    await connectMongo();

    const { userId, userurl } = await req.json();

    if (!userId || !userurl || userurl.trim().length < 5) {
      return new Response(
        JSON.stringify({ message: "Invalid data. Ensure URL is at least 5 characters long." }),
        { status: 400 }
      );
    }

    // Check if the URL is already taken by another user
    const existingUser = await User.findOne({ userurl });
    if (existingUser && existingUser._id.toString() !== userId) {
      return new Response(
        JSON.stringify({ message: "URL is already taken. Please choose another one." }),
        { status: 400 }
      );
    }

    // Update the user's URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userurl },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found. Unable to update URL." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "URL updated successfully.", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating URL:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "nodejs", // Explicitly set runtime to Node.js
};
