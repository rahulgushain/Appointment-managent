const OPTIONS = ['All', 'Pending', 'Confirmed', 'Cancelled'];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
      {OPTIONS.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              active
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}