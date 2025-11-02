'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status]);

  const updateQuantity = async (productId: string, quantity: number) => {
    // This would require a new API endpoint to update individual item quantities
    // For now, we will refetch the cart
    alert('Updating quantity is not implemented yet. Refetching cart.');
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    // This would require a new API endpoint to remove an item
    alert('Removing item is not implemented yet. Refetching cart.');
    fetchCart();
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' });
      if (res.ok) {
        setCart(null);
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please <Link href="/customer/login">login</Link> to view your cart.</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const totalPrice = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.product._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-20 h-20">
                          <Image src={item.product.image} alt={item.product.name} width={80} height={80} className="w-full h-full rounded-md object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">{item.product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${item.product.price.toFixed(2)}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value, 10))} className="w-16 text-center border" />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <button onClick={() => removeItem(item.product._id)} className="text-red-500 hover:text-red-700">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={clearCart} className="text-red-500 hover:text-red-700 mt-4">Clear Cart</button>
        </div>
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-orange-600 transition-colors duration-200">Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
