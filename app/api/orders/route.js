import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await Order.find({}).populate('user', 'username');
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = await req.json();

    const order = await Order.create({
      user: session.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
