export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search by customer name
      </label>
      <input
        id="search"
        type="search"
        className="input"
        placeholder="Search customer name…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
