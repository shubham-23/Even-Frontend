'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalBookings: 0, totalSeats: 0 });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.replace('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setForm({ name: parsed.name || '', email: parsed.email || '' });
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/register/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const total = data.data.reduce((sum, t) => sum + t.seatsBooked, 0);
        setStats({ totalBookings: data.data.length, totalSeats: total });
      }
    } catch {
      // silently ignore stats fetch errors
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg({ text: 'Name cannot be empty.', type: 'error' });
      return;
    }
    setLoading(true);
    // Update local storage only (no separate profile endpoint needed)
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const updated = { ...stored, name: form.name };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      window.dispatchEvent(new Event('auth-change'));
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch {
      setMsg({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-indigo-400">{stats.totalBookings}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wide">Total Bookings</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-emerald-400">{stats.totalSeats}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wide">Seats Reserved</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-5">Account Details</h2>

          {msg.text && (
            <div className={`p-3 rounded-lg text-sm mb-4 border ${msg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-rose-950/80 text-rose-300 border-rose-800'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1">Email cannot be changed.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Log Out
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
