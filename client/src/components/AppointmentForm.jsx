import { useState } from 'react';

const empty = { customerName: '', service: '', dateTime: '', status: 'Pending' };

function validate(v) {
  const e = {};
  if (!v.customerName.trim()) e.customerName = 'Customer name is required.';
  if (!v.service.trim()) e.service = 'Service is required.';
  if (!v.dateTime) e.dateTime = 'Date/time is required.';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function AppointmentForm({ onSubmit }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const cls = (field) => `input ${errors[field] ? 'input-error' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setFormError('');
    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(empty);
      setSuccess('Appointment added.');
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <div role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
          {formError}
        </div>
      )}
      {success && (
        <div role="status" className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 ring-1 ring-green-200">
          {success}
        </div>
      )}

      <Field id="customerName" label="Customer name *" error={errors.customerName}>
        <input id="customerName" className={cls('customerName')} value={values.customerName}
          onChange={set('customerName')} aria-invalid={!!errors.customerName} />
      </Field>

      <Field id="service" label="Service *" error={errors.service}>
        <input id="service" className={cls('service')} value={values.service}
          onChange={set('service')} aria-invalid={!!errors.service} />
      </Field>

      <Field id="dateTime" label="Date / time *" error={errors.dateTime}>
        <input id="dateTime" type="datetime-local" className={cls('dateTime')} value={values.dateTime}
          onChange={set('dateTime')} aria-invalid={!!errors.dateTime} />
      </Field>

      <Field id="status" label="Status" error={errors.status}>
        <select id="status" className={cls('status')} value={values.status} onChange={set('status')}>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Cancelled</option>
        </select>
      </Field>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : 'Add appointment'}
      </button>
    </form>
  );
}