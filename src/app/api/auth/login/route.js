import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User.model';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found. Please sign up first.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set secure cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: 3600, // 1 hour
      })
    );
    headers.append(
      'Set-Cookie',
      serialize('id', user._id.toString(), {
        sameSite: 'strict',
        secure: isProduction,
        path: '/',
        maxAge: 3600, // 1 hour
      })
    );
    headers.append(
      'Set-Cookie',
      serialize('name', user.name, {
        sameSite: 'strict',
        secure: isProduction,
        path: '/',
        maxAge: 3600, // 1 hour
      })
    );
    headers.append(
      'Set-Cookie',
      serialize('email', user.email, {
        sameSite: 'strict',
        secure: isProduction,
        path: '/',
        maxAge: 3600, // 1 hour
      })
    );

    // Return the response with the token and user data
    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userurl: user.userurl,
          links: user.links,
          bio: user.bio,
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error during login:', error.message);
    return new Response(
      JSON.stringify({ message: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
