const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw { message: 'Cannot reach the server. Is the API running?' };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.message || 'Request failed.', errors: data.errors || {} };
  return data;
}

export const fetchAppointments = ({ status, search }) => {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.set('status', status);
  if (search && search.trim()) params.set('search', search.trim());
  const qs = params.toString();
  return request(`/appointments${qs ? `?${qs}` : ''}`);
};

export const createAppointment = (body) =>
  request('/appointments', { method: 'POST', body: JSON.stringify(body) });

export const updateStatus = (id, status) =>
  request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });