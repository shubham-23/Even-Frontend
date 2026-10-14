'use client';

export default function HeroBanner({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenCreateModal,
}) {
  return (
    <div className="relative overflow-hidden mb-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-8 sm:p-12 shadow-2xl">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Next-Gen Tech Gathering Platform</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Discover &amp; Reserve <br />
          <span className="gradient-text">World-Class Tech Events</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Connect with industry visionaries, level up your engineering skills, and reserve instant digital pass tickets in real-time.
        </p>

        {/* Live Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10 text-center">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-2xl font-black text-white">24+</p>
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Live Summits</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-2xl font-black text-emerald-400">15K+</p>
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Registered</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-2xl font-black text-indigo-400">99.9%</p>
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Seat Reliability</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md">
            <p className="text-2xl font-black text-cyan-400">Instant</p>
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">E-Tickets</p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by event title, location, topics (e.g. AI, React, Cloud)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-11 pr-10 py-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Categories:</span>
          {['All', 'AI & Data', 'Development', 'Cloud & DevOps', 'Cybersecurity', 'Design & UX'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
