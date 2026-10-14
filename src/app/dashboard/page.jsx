'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null); // { ticket, newSeats }
  const [actionMsg, setActionMsg] = useState({ id: '', text: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.replace('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchMyTickets(token);
  }, [router]);

  const fetchMyTickets = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/register/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  // Delete a booking
  const handleDelete = async (ticketId) => {
    if (!confirm('Cancel this booking? Seats will be restored.')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/bookings/${ticketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTickets((prev) => prev.filter((t) => t._id !== ticketId));
        setActionMsg({ id: '', text: 'Booking cancelled.', type: 'success' });
        setTimeout(() => setActionMsg({ id: '', text: '', type: '' }), 3000);
      } else {
        setActionMsg({ id: ticketId, text: data.error || 'Failed to cancel.', type: 'error' });
      }
    } catch {
      setActionMsg({ id: ticketId, text: 'Server error.', type: 'error' });
    }
  };

  // Edit booking seats
  const handleEdit = async () => {
    const { ticket, newSeats } = editingTicket;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/bookings/${ticket._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seats: newSeats }),
      });
      const data = await res.json();
      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (t._id === ticket._id ? { ...t, seatsBooked: Number(newSeats) } : t))
        );
        setEditingTicket(null);
        setActionMsg({ id: '', text: 'Booking updated!', type: 'success' });
        setTimeout(() => setActionMsg({ id: '', text: '', type: '' }), 3000);
      } else {
        setActionMsg({ id: ticket._id, text: data.error || 'Failed to update.', type: 'error' });
      }
    } catch {
      setActionMsg({ id: editingTicket.ticket._id, text: 'Server error.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Ticket Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Logged in as <span className="text-indigo-400 font-semibold">{user?.email}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-indigo-600/30"
            >
              Browse Events
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Global action message */}
        {actionMsg.text && !actionMsg.id && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${actionMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-rose-950/80 text-rose-300 border-rose-800'}`}>
            {actionMsg.text}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 mb-4">You haven't booked any event tickets yet.</p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-indigo-600/30"
            >
              Discover &amp; Reserve Seats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white">{ticket.eventId?.title || 'Event Details Unavailable'}</h2>
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {ticket.seatsBooked} {ticket.seatsBooked === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">📍 {ticket.eventId?.location}</p>
                <p className="text-xs text-indigo-400 mb-4">📅 {ticket.eventId?.date}</p>

                {/* Per-ticket error message */}
                {actionMsg.id === ticket._id && (
                  <div className={`mb-3 p-2 rounded text-xs border ${actionMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-rose-950/80 text-rose-300 border-rose-800'}`}>
                    {actionMsg.text}
                  </div>
                )}

                {/* Edit inline form */}
                {editingTicket?.ticket._id === ticket._id ? (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      min="1"
                      value={editingTicket.newSeats}
                      onChange={(e) => setEditingTicket({ ...editingTicket, newSeats: e.target.value })}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleEdit}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded-lg font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTicket(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <div className="text-xs text-slate-500 font-mono">
                    <div>ID: {ticket._id}</div>
                    <div>{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTicket({ ticket, newSeats: ticket.seatsBooked })}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 hover:border-indigo-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}