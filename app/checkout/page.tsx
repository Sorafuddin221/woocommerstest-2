'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData = {
      items: cart.items,
      shippingAddress: { address, city, postalCode, country },
      paymentMethod,
      totalPrice: cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        if (paymentMethod === 'Stripe') {
          const stripeRes = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: data._id }),
          });
          const stripeData = await stripeRes.json();
          if (stripeData.url) {
            window.location.href = stripeData.url;
          }
        } else {
          router.push(`/orders/${data._id}`);
        }
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please <a href="/customer/login">login</a> to proceed to checkout.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
            <h2 className="text-lg font-bold mt-6 mb-4">Payment Method</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                <option value="Stripe">Card Payment (Stripe)</option>
                <option value="bKash">bKash</option>
                <option value="CashOnDelivery">Cash on Delivery</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md mt-6 hover:bg-orange-600 transition-colors duration-200">Place Order</button>
          </form>
        </div>
        <div className="md:w-1/3">
          {/* Order Summary can be displayed here */}
        </div>
      </div>
    </div>
  );
}
