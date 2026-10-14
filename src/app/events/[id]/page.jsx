'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingModal from '@/app/components/BookingModal';
import { API_URL } from '@/lib/api';

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setEvent(null);
      }
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatBooked = (eventId, seatsBooked) => {
    setEvent((prev) => ({ ...prev, availableSeats: Math.max(0, prev.availableSeats - seatsBooked) }));
    setToast(`Successfully booked ${seatsBooked} seat(s)!`);
    setTimeout(() => setToast(''), 4000);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 text-lg">Event not found.</p>
        <Link href="/" className="text-indigo-400 hover:underline text-sm">← Back to Events</Link>
      </div>
    );
  }

  const isSoldOut = event.availableSeats === 0;
  const capacityPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border bg-emerald-950 text-emerald-200 border-emerald-800">
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          ← Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              📅 {event.date}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isSoldOut ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
              {isSoldOut ? 'Sold Out' : `${event.availableSeats} seats left`}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">{event.title}</h1>
          <p className="text-indigo-400 text-sm mb-6">📍 {event.location}</p>

          <p className="text-slate-300 leading-relaxed mb-8">{event.description}</p>

          {/* Capacity bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
              <span>Capacity</span>
              <span>{event.totalSeats - event.availableSeats} / {event.totalSeats} seats filled</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-white">{event.totalSeats}</p>
              <p className="text-xs text-slate-500 mt-1">Total Seats</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-400">{event.availableSeats}</p>
              <p className="text-xs text-slate-500 mt-1">Available</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-indigo-400">{event.totalSeats - event.availableSeats}</p>
              <p className="text-xs text-slate-500 mt-1">Booked</p>
            </div>
          </div>

          {/* Book button */}
          <button
            onClick={() => setShowModal(true)}
            disabled={isSoldOut}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${isSoldOut ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'}`}
          >
            {isSoldOut ? 'Registration Closed' : 'Reserve Your Seat'}
          </button>
        </div>
      </div>

      {showModal && (
        <BookingModal
          event={event}
          onClose={() => setShowModal(false)}
          onSuccess={handleSeatBooked}
        />
      )}
    </div>
  );
}
