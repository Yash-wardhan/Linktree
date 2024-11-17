import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/utils/auth';

export async function POST(req) {
  try {
    await connectMongo();

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Authorization token missing' }),
        { status: 401 }
      );
    }

    const { userurl } = await req.json();
    const userId = verifyToken(token); // Verify token and extract user ID

    if (!userurl || userurl.trim().length === 0) {
      return new Response(
        JSON.stringify({ message: 'URL cannot be empty' }),
        { status: 400 }
      );
    }

    // Check if URL is already taken
    const existingUser = await User.findOne({ userurl });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'URL is already taken' }),
        { status: 400 }
      );
    }

    // Update user's custom URL
    await User.findByIdAndUpdate(userId, { userurl });

    return new Response(
      JSON.stringify({ message: 'Custom URL set successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}