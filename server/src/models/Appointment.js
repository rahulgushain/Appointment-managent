const mongoose = require('mongoose');

const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

const appointmentSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    service: { type: String, required: true, trim: true, maxlength: 100 },
    dateTime: { type: Date, required: true },
    status: { type: String, enum: STATUSES, default: 'Pending' },
  },
  { timestamps: true }
);

appointmentSchema.index({ customerName: 1 });
appointmentSchema.index({ dateTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
Appointment.STATUSES = STATUSES;
module.exports = Appointment;