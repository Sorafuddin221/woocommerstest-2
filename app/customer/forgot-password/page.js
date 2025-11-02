"use client";
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const response = await fetch('/api/auth/customer/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="bg-gray-100 antialiased">
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Submit
            </button>
            {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}
