import connectMongo from '@/lib/mongodb';
import User from '@/models/User.model';
import { verifyToken } from '@/utils/auth';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Verify the token and get the user ID
    const userId = verifyToken(request);

    // Parse the request body
    const { link } = await request.json();

    // Validate the input
    if (!link || !link.title || !link.url) {
      return new Response(
        JSON.stringify({ message: 'Invalid link data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add the link to the user's list
    user.links.push(link);
    await user.save();

    // Return sanitized user data
    const sanitizedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      links: user.links.map((link) => ({
        id: link._id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        order: link.order,
      })),
    };

    return new Response(
      JSON.stringify({ message: 'Link added successfully!', user: sanitizedUser }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request) {
    try {
      // Connect to MongoDB
      await connectMongo();
  
      // Verify the token and get the user ID
      const userId = verifyToken(request);
  
      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const sortOrder = searchParams.get('sortOrder') || 'asc'; // Default to ascending
      const filterTitle = searchParams.get('title'); // Optional filter by title
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return new Response(
          JSON.stringify({ message: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Filter and sort links
      let links = user.links.map((link) => ({
        id: link._id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        order: link.order,
      }));
  
      if (filterTitle) {
        links = links.filter((link) =>
          link.title.toLowerCase().includes(filterTitle.toLowerCase())
        );
      }
  
      links.sort((a, b) =>
        sortOrder === 'asc' ? a.order - b.order : b.order - a.order
      );
  
      return new Response(
        JSON.stringify(links),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error in GET:', error);
      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }