const express = require('express');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

const router = express.Router();
const { STATUSES } = Appointment;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function validateBody(body, { partial = false } = {}) {
  const errors = {};
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';

  if (!customerName) errors.customerName = 'Customer name is required.';
  else if (customerName.length > 100) errors.customerName = 'Customer name must be 100 characters or fewer.';

  if (!service) errors.service = 'Service is required.';
  else if (service.length > 100) errors.service = 'Service must be 100 characters or fewer.';

  if (!body.dateTime) errors.dateTime = 'Date/time is required.';
  else if (Number.isNaN(new Date(body.dateTime).getTime())) errors.dateTime = 'Date/time is not valid.';

  const status = body.status || 'Pending';
  if (!STATUSES.includes(status)) errors.status = `Status must be one of: ${STATUSES.join(', ')}.`;

  return { errors, value: { customerName, service, dateTime: body.dateTime, status } };
}

// GET /api/appointments?status=Pending&search=alex
router.get('/', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status filter.' });
      }
      filter.status = status;
    }
    if (search && String(search).trim()) {
      filter.customerName = { $regex: escapeRegex(String(search).trim()), $options: 'i' };
    }

    const appointments = await Appointment.find(filter).sort({ dateTime: 1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// POST /api/appointments
router.post('/', async (req, res, next) => {
  try {
    const { errors, value } = validateBody(req.body || {});
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }
    const created = await Appointment.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid appointment id.' });

    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Validation failed.',
        errors: { status: `Status must be one of: ${STATUSES.join(', ')}.` },
      });
    }
    const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Appointment not found.' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;