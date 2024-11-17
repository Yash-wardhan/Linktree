import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User.model";
import DashboardClient from "@/components/Dashboard/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectMongo();

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      redirect("/login");
    }

    // Serialize the user data to ensure compatibility with Client Components
    const serializedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userurl: user.userurl || "",
      links: user.links.map((link) => ({
        title: link.title,
        url: link.url,
        id: link._id ? link._id.toString() : undefined,
      })),
    };

    return <DashboardClient user={serializedUser} />;
  } catch (error) {
    console.error("Error decoding token or fetching user:", error.message);
    redirect("/login");
  }
}
