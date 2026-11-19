import { useCallback, useEffect, useState } from 'react';
import { fetchAppointments, createAppointment, updateStatus } from './api';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import StatusFilter from './components/StatusFilter';
import SearchBar from './components/SearchBar';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(await fetchAppointments({ status, search: debouncedSearch }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data) => {
    await createAppointment(data); // errors handled by the form
    await load();
  };

  const handleStatusChange = async (id, newStatus) => {
    setError('');
    try {
      await updateStatus(id, newStatus);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Appointment Manager</h1>
        </header>

        <main className="grid gap-4 lg:grid-cols-[340px_1fr] lg:items-start">
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">New appointment</h2>
            <AppointmentForm onSubmit={handleCreate} />
          </section>

          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Appointments</h2>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchBar value={search} onChange={setSearch} />
              <StatusFilter value={status} onChange={setStatus} />
            </div>

            {error && (
              <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <AppointmentList
              appointments={appointments}
              loading={loading}
              onStatusChange={handleStatusChange}
              filtered={status !== 'All' || debouncedSearch.trim() !== ''}
            />
          </section>
        </main>
      </div>
    </div>
  );
}