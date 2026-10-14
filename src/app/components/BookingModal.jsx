'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

export default function BookingModal({ event, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', seats: 1 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setIsLoggedIn(true);
        const parsed = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
        }));
      }
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSeatChange = (delta) => {
    const next = formData.seats + delta;
    if (next >= 1 && next <= event.availableSeats) {
      setFormData({ ...formData, seats: next });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setMessage({
        type: 'error',
        text: 'Please log in to complete your ticket reservation.',
      });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          name: formData.name,
          email: formData.email,
          seatsRequested: Number(formData.seats),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingComplete(data.data);
        onSuccess(event._id, Number(formData.seats));
      } else {
        if (res.status === 401) {
          setMessage({
            type: 'error',
            text: 'Session expired. Please log in again.',
          });
        } else {
          setMessage({ type: 'error', text: data.error || 'Reservation failed.' });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Server connection failed. Ensure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = (event.price || 0) * formData.seats;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {bookingComplete ? (
          /* Confirmation Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto animate-bounce">
              ✓
            </div>

            <h3 className="text-2xl font-black text-white">Ticket Confirmed!</h3>
            <p className="text-sm text-slate-300">
              Your spot for <span className="text-indigo-400 font-bold">{event.title}</span> has been reserved.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 my-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Ticket Code:</span>
                <span className="text-emerald-400 font-bold">{bookingComplete.ticketCode || 'EP-88A2X'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Seats Reserved:</span>
                <span className="text-white font-bold">{bookingComplete.seatsBooked}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Paid:</span>
                <span className="text-indigo-400 font-bold">${bookingComplete.totalAmount || 0}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex-1 gradient-glow-btn text-white py-3 rounded-xl font-bold text-sm text-center shadow-lg"
              >
                View My E-Tickets
              </Link>
              <button
                onClick={onClose}
                className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            {/* Header info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
                alt={event.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {event.category || 'Tech Event'}
                </span>
                <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                <p className="text-xs text-slate-400">📍 {event.location}</p>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="bg-amber-950/60 border border-amber-800/80 text-amber-200 p-3 rounded-xl text-xs mb-4 flex items-center justify-between">
                <span>Please log in to reserve seats.</span>
                <Link
                  href="/login"
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition-colors"
                >
                  Log In
                </Link>
              </div>
            )}

            {message.text && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 border ${
                  message.type === 'error'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Interactive Seat Counter */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Select Seats (Available: {event.availableSeats})
                </label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-2">
                  <button
                    type="button"
                    onClick={() => handleSeatChange(-1)}
                    disabled={formData.seats <= 1}
                    className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-white font-mono">{formData.seats} Seat(s)</span>
                  <button
                    type="button"
                    onClick={() => handleSeatChange(1)}
                    disabled={formData.seats >= event.availableSeats}
                    className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-700 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Price:</span>
                <span className="text-base font-black text-indigo-400 font-mono">
                  {totalPrice === 0 ? 'FREE' : `$${totalPrice}`}
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isLoggedIn}
                  className="w-1/2 gradient-glow-btn text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}