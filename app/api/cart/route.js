import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/lib/models/Cart';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let cart = await Cart.findOne({ user: session.user.id }).populate('items.product');
    if (!cart) {
      cart = { items: [] };
    }
    return NextResponse.json(cart);
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
    const { productId, quantity } = await req.json();
    let cart = await Cart.findOne({ user: session.user.id });

    if (cart) {
      // Cart exists, update it
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    } else {
      // No cart, create one
      cart = await Cart.create({
        user: session.user.id,
        items: [{ product: productId, quantity }],
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await Cart.findOneAndDelete({ user: session.user.id });
        return NextResponse.json({ message: 'Cart cleared' });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
