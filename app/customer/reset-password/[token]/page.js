"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch('/api/auth/customer/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
      setTimeout(() => {
        router.push('/customer/login');
      }, 3000);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="bg-gray-100 antialiased">
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Reset Password
            </button>
            {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}
