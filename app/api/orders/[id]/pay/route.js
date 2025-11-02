import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PUT(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await Order.findById(params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      return NextResponse.json(updatedOrder);
    } else {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
