import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  const { userurl } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongo();
    const user = await User.findOne({ userurl });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
