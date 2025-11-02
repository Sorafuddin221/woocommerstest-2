import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  await connectDB();

  try {
    const { token, password } = await req.json();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({ message: 'Password reset successful' });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
