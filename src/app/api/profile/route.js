import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req) {
  try {
    const { userId, username, links, bio } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
      });
    }

    await connectMongo();

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { userurl, links, bio },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}