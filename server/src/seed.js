require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

const data = [
  { customerName: 'Alex Morgan', service: 'Consultation', dateTime: new Date('2026-11-02T10:00:00'), status: 'Pending' },
  { customerName: 'Jamie Lee', service: 'Follow-up', dateTime: new Date('2026-11-02T11:30:00'), status: 'Confirmed' },
  { customerName: 'Taylor Smith', service: 'Review', dateTime: new Date('2026-11-03T14:00:00'), status: 'Cancelled' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Appointment.countDocuments();
    if (count > 0 && !process.argv.includes('--reset')) {
      console.log(`Database already has ${count} appointments. Use "npm run seed -- --reset" to wipe and reseed.`);
    } else {
      await Appointment.deleteMany({});
      await Appointment.insertMany(data);
      console.log('Seeded 3 appointments.');
    }
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();