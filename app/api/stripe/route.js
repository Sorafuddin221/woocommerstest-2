import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Order from '@/lib/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/orders/${order._id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/orders/${order._id}`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return NextResponse.json({ id: stripeSession.id });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
