'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import EventCard from './components/EventCard';
import BookingModal from './components/BookingModal';
import SkeletonCard from './components/SkeletonCard';
import { API_URL } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    setAuthChecking(false);
  }, [router]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
      });

      const res = await fetch(`${API_URL}/api/events?${params}`);
      const data = await res.json();

      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      showToast('Failed to connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (authChecking) return;
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300); 

    return () => clearTimeout(timer);
  }, [fetchEvents, authChecking]);

  const handleSeatBooked = (eventId, seatsBooked) => {
    
    setEvents((prev) =>
      prev.map((item) =>
        item._id === eventId
          ? { ...item, availableSeats: Math.max(0, item.availableSeats - seatsBooked) }
          : item
      )
    );
    showToast(`Successfully booked ${seatsBooked} seat(s)!`);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 relative">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border transition-all transform slide-in-from-top-2 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Header />


        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search events by title, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Events</option>
            <option value="available">Available Seats</option>
            <option value="soldout">Sold Out</option>
          </select>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onBook={setSelectedEvent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-base">No matching events found.</p>
          </div>
        )}
      </div>

      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={handleSeatBooked}
        />
      )}
    </div>
  );
}