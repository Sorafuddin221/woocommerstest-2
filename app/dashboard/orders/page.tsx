'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  user: {
    username: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchOrders();
        } else {
          console.error('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivered</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order._id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.user?.username}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${order.totalPrice.toFixed(2)}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.isPaid ? 'Yes' : 'No'}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.isDelivered ? 'Yes' : 'No'}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link href={`/dashboard/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                  <button onClick={() => deleteOrder(order._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
