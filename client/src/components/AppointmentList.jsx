const formatDate = (iso) =>
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

// Full class names so Tailwind can detect them at build time
const BADGE = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function AppointmentList({ appointments, loading, onStatusChange, filtered }) {
  if (loading) return <p className="py-6 text-center text-slate-500">Loading…</p>;

  if (!appointments.length) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 py-8 text-center text-slate-500">
        {filtered ? 'No appointments match your search/filter.' : 'No appointments yet.'}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {appointments.map((a) => (
        <li
          key={a._id}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold">{a.customerName}</p>
            <p className="text-slate-700">{a.service}</p>
            <p className="text-sm text-slate-500">{formatDate(a.dateTime)}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[a.status]}`}>
              {a.status}
            </span>
            <label htmlFor={`status-${a._id}`} className="sr-only">
              Change status for {a.customerName}
            </label>
            <select
              id={`status-${a._id}`}
              value={a.status}
              onChange={(e) => onStatusChange(a._id, e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}