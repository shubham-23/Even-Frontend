'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EventCard({ event, onBook, isBookmarked = false, onToggleBookmark }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const isSoldOut = event.availableSeats === 0;
  const capacityPercentage = Math.min(
    100,
    Math.max(0, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
  );

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    if (onToggleBookmark) {
      onToggleBookmark(event._id);
    }
  };

  // Seats bar color
  let progressColor = 'bg-emerald-500';
  if (capacityPercentage > 85) progressColor = 'bg-rose-500';
  else if (capacityPercentage > 60) progressColor = 'bg-amber-500';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group h-full relative border border-slate-800">
      
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/80 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
          {event.category || 'Tech'}
        </span>

        {/* Price Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full shadow-lg ${
            event.price === 0
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-indigo-600 text-white border border-indigo-400/50'
          }`}
        >
          {event.price === 0 ? 'FREE' : `$${event.price}`}
        </span>

        {/* Bookmark Heart Button */}
        <button
          onClick={handleBookmarkClick}
          title={bookmarked ? 'Remove from saved' : 'Save event'}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white flex items-center justify-center text-sm hover:scale-110 transition-transform"
        >
          {bookmarked ? '❤️' : '🤍'}
        </button>

        {/* Date Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-slate-200 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
          <span>📅</span>
          <span>{event.date}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-indigo-400 font-medium mb-3 flex items-center gap-1">
            <span>📍</span> {event.location}
          </p>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Capacity Meter & Action Buttons */}
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1 font-mono">
              <span>Capacity</span>
              <span className={isSoldOut ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                {isSoldOut ? 'SOLD OUT' : `${event.availableSeats} / ${event.totalSeats} seats left`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-500`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/events/${event._id}`}
              className="flex-1 py-2 rounded-xl font-bold text-xs text-center bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/80 flex items-center justify-center"
            >
              Details
            </Link>
            <button
              onClick={() => onBook(event)}
              disabled={isSoldOut}
              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                isSoldOut
                  ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Reserve Spot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}