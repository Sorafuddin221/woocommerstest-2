"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Import signIn

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => { // Make handleSubmit async
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false, // Do not redirect automatically
    });

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.ok) {
      router.push('/customer/account'); // Redirect to customer account page on success
    }
  };

  return (
    <div className="bg-gray-100 antialiased">

      {/* Login Form Section */}
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Customer Login</h2>
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Login
            </button>
            {errorMessage && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}
            <p className="text-sm text-center mt-4">
              Don't have an account?{' '}
              <Link href="/customer/register" className="font-medium text-orange-600 hover:text-orange-500">
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}