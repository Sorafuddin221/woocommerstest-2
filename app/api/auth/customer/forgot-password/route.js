import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(req) {
  await connectDB();

  try {
    const { username } = await req.json();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiration date
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // In a real application, you would send an email with the reset link.
    // For this example, we'll return the token in the response.
    return NextResponse.json({ message: `Password reset token generated.`, token: resetToken });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
