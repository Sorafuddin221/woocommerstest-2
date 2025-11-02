import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  await connectDB();

  try {
    const { username, password } = await req.json();

    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      role: 'user',
    });

    if (user) {
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
