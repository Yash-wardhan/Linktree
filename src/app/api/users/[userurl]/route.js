import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";

export async function GET(req, { params }) {
  try {
    const { userurl } = params;

    await connectMongo();

    const user = await User.findOne({ userurl }).lean();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}