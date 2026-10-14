export default function Header() {
  return (
    <header className="mb-12 text-center border-b border-slate-800 pb-8">
      <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-3 py-1 rounded-full">
        Live Booking System
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4">
        EventPulse <span className="text-indigo-500">.</span>
      </h1>
      <p className="text-slate-400 mt-2 text-lg">
        Discover upcoming tech events and reserve your seats in real-time.
      </p>
    </header>
  );
}