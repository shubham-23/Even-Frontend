'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';

export default function CreateEventModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '09:00 AM PST',
    location: '',
    category: 'Technology',
    price: 0,
    totalSeats: 100,
    image: '',
    description: '',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setError('You must be logged in to host an event.');
      return;
    }

    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const tagArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          totalSeats: Number(formData.totalSeats),
          tags: tagArray,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onCreated(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to create event.');
      }
    } catch {
      setError('Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            Organizer Portal
          </span>
          <h2 className="text-2xl font-black text-white mt-2">Host &amp; Publish New Event</h2>
          <p className="text-xs text-slate-400">Fill in event details to make it available for instant booking.</p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-3 rounded-xl text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI & Machine Learning Summit 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="AI & Data">AI & Data</option>
                <option value="Development">Development</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Design & UX">Design & UX</option>
                <option value="Technology">Technology General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Price ($ USD) *
              </label>
              <input
                type="number"
                min="0"
                placeholder="0 for Free"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Event Date *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nov 15, 2026"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Total Capacity Seats *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Location / Venue *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tech Pavilion, San Francisco & Online"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Description *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Describe event agenda, keynote topics, and who should attend..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="AI, Nextjs, Cloud, Coding"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-950 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
