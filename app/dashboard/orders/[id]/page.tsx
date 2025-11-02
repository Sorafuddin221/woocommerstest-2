'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Order {
  _id: string;
  user: {
    username: string;
  };
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const markAsDelivered = async () => {
    try {
      const res = await fetch(`/api/orders/${id}/deliver`, { method: 'PUT' });
      if (res.ok) {
        fetchOrder();
      } else {
        console.error('Failed to mark as delivered');
      }
    } catch (error) {
      console.error('Error marking as delivered:', error);
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
        <p><strong>User:</strong> {order.user?.username}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleString()}` : 'Not Paid'}</p>
        <p><strong>Delivery Status:</strong> {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleString()}` : 'Not Delivered'}</p>
        
        <h2 className="text-xl font-bold mt-6 mb-4">Shipping Address</h2>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>

        <h2 className="text-xl font-bold mt-6 mb-4">Order Items</h2>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>{item.product.name}</strong></p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>

        {!order.isDelivered && (
          <button onClick={markAsDelivered} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md mt-6 hover:bg-green-600 transition-colors duration-200">Mark as Delivered</button>
        )}
      </div>
    </div>
  );
}
