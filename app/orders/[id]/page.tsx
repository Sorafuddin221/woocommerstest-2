'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Order {
  _id: string;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
}

export default function OrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          console.error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [id, status]);

  const handleBkashPayment = async () => {
    // In a real app, you would have a callback from bKash to verify the payment.
    // Here, we'll just mark the order as paid.
    try {
      const res = await fetch(`/api/orders/${id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod: 'bKash' }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        alert('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleString()}` : 'Not Paid'}</p>

        {order.paymentMethod === 'bKash' && !order.isPaid && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-bold">bKash Payment Instructions</h2>
            <p>Please complete your bKash payment to the following number: <strong>01234567890</strong></p>
            <p>Use your order ID as the reference.</p>
            <button onClick={handleBkashPayment} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 transition-colors duration-200">Confirm Payment</button>
          </div>
        )}

        {order.paymentMethod === 'CashOnDelivery' && !order.isPaid && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-bold">Cash on Delivery</h2>
            <p>You will pay when the order is delivered to you.</p>
          </div>
        )}

        {order.paymentMethod === 'Stripe' && order.isPaid && (
            <div className="mt-4 p-4 border rounded-lg bg-green-100">
                <h2 className="text-lg font-bold">Payment Successful</h2>
                <p>Your payment has been processed successfully.</p>
            </div>
        )}
      </div>
    </div>
  );
}
