import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function POST(req) {
  try {
    await connectMongo();

    const { userurl } = await req.json();

    if (!userurl || userurl.trim().length < 5) {
      return new Response(
        JSON.stringify({ message: "Invalid data. Ensure URL is at least 5 characters long." }),
        { status: 400 }
      );
    }

    // Check if the URL is already taken
    const existingUser = await User.findOne({ userurl });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "URL is already taken. Please choose another one." }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: "URL is available." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking URL:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
