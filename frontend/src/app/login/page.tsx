'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginPayload } from '@/lib/api/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Backend Response:", response);
      localStorage.setItem('token', response.access_token);
      router.push('/chat');
    } catch (err: any) {
      console.log("Error Details:", err);
      console.log("Backend Error Response:", err.response?.data);
      setError(err.response?.data?.detail || 'Login failed');
    }
    
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
