import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, login } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-[#ECECEC] p-8 space-y-6 bg-white">
        <h1 className="text-3xl font-black">Welcome Back</h1>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full bg-[#FAFAFA] border border-[#ECECEC] px-4 py-3 outline-none focus:border-[#111111]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full bg-[#FAFAFA] border border-[#ECECEC] px-4 py-3 outline-none focus:border-[#111111]"
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          className="w-full bg-[#111111] text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-[#D92D20] transition-colors"
        >
          Log In
        </button>

        <p className="text-sm text-[#666666]">
          New here?{' '}
          <Link to="/signup" className="text-[#D92D20] hover:text-[#111111]">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
