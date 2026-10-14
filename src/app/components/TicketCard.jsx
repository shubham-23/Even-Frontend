'use client';

import { useState } from 'react';

export default function TicketCard({ ticket, onEdit, onDelete, actionMsg }) {
  const event = ticket.eventId || {};
  const isMsgForThisTicket = actionMsg && actionMsg.id === ticket._id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
      {/* Decorative top ribbon */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Confirmed Pass
          </span>
        </div>
        <span className="font-mono text-xs font-black text-indigo-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">
          {ticket.ticketCode || `EP-${ticket._id.substring(ticket._id.length - 6).toUpperCase()}`}
        </span>
      </div>

      {/* Ticket Body Content */}
      <div className="mb-6">
        <h3 className="text-xl font-black text-white mb-2 leading-tight">
          {event.title || 'Event Information Unavailable'}
        </h3>

        <div className="space-y-1 text-xs text-slate-300 mb-4">
          <p className="flex items-center gap-1.5 text-indigo-300 font-medium">
            <span>📍</span> {event.location || 'Online / Venue TBD'}
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>📅</span> {event.date || 'TBD'} &bull; {event.time || '09:00 AM PST'}
          </p>
        </div>

        {/* Seat breakdown pill & price */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Seats Booked</span>
            <span className="text-base font-black text-emerald-400">{ticket.seatsBooked} Seat(s)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-sans">Total Paid</span>
            <span className="text-base font-black text-indigo-400">
              {ticket.totalAmount !== undefined && ticket.totalAmount > 0
                ? `$${ticket.totalAmount}`
                : 'FREE'}
            </span>
          </div>
        </div>
      </div>

      {/* QR Code Mock & Perforation Line */}
      <div className="border-t border-dashed border-slate-800 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* QR Code Icon Visual */}
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex flex-col justify-between shadow-inner">
            <div className="grid grid-cols-3 gap-0.5 w-full h-full">
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-400 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
              <div className="bg-slate-950 rounded-sm"></div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            <p>ISSUED: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            <p className="text-slate-400">SCAN AT ENTRANCE</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(ticket)}
            title="Edit number of seats"
            className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(ticket._id)}
            title="Cancel ticket"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            🗑️ Cancel
          </button>
          <button
            onClick={handlePrint}
            title="Print ticket pass"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-950"
          >
            🖨️
          </button>
        </div>
      </div>

      {/* Ticket Specific Feedback Message */}
      {isMsgForThisTicket && (
        <div
          className={`mt-3 p-2 rounded-xl text-xs border ${
            actionMsg.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}
        >
          {actionMsg.text}
        </div>
      )}
    </div>
  );
}
