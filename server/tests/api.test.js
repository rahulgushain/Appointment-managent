const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');
const Appointment = require('../src/models/Appointment');

let mongod;

beforeAll(async () => {
  if (process.env.MONGO_TEST_URI) {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  } else {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  }
});
afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});
beforeEach(async () => {
  await Appointment.deleteMany({});
  await Appointment.insertMany([
    { customerName: 'Alex Morgan', service: 'Consultation', dateTime: '2026-11-02T10:00:00', status: 'Pending' },
    { customerName: 'Jamie Lee', service: 'Follow-up', dateTime: '2026-11-02T11:30:00', status: 'Confirmed' },
    { customerName: 'Taylor Smith', service: 'Review', dateTime: '2026-11-03T14:00:00', status: 'Cancelled' },
  ]);
});

test('lists all appointments', async () => {
  const res = await request(app).get('/api/appointments');
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(3);
});

test('filters by status', async () => {
  const res = await request(app).get('/api/appointments?status=Confirmed');
  expect(res.body).toHaveLength(1);
  expect(res.body[0].customerName).toBe('Jamie Lee');
});

test('rejects invalid status filter', async () => {
  const res = await request(app).get('/api/appointments?status=Nope');
  expect(res.status).toBe(400);
});

test('searches by customer name, case-insensitive, partial', async () => {
  const res = await request(app).get('/api/appointments?search=aLeX');
  expect(res.body).toHaveLength(1);
});

test('search treats regex characters literally', async () => {
  const res = await request(app).get('/api/appointments?search=.*');
  expect(res.body).toHaveLength(0);
});

test('search and status combine', async () => {
  const res = await request(app).get('/api/appointments?search=a&status=Pending');
  expect(res.body.map((a) => a.customerName)).toEqual(['Alex Morgan']);
});

test('creates an appointment', async () => {
  const res = await request(app)
    .post('/api/appointments')
    .send({ customerName: '  Sam Fox ', service: 'Checkup', dateTime: '2026-12-01T09:00', status: 'Pending' });
  expect(res.status).toBe(201);
  expect(res.body.customerName).toBe('Sam Fox');
});

test('validates required fields on create', async () => {
  const res = await request(app).post('/api/appointments').send({});
  expect(res.status).toBe(400);
  expect(res.body.errors).toHaveProperty('customerName');
  expect(res.body.errors).toHaveProperty('service');
  expect(res.body.errors).toHaveProperty('dateTime');
});

test('updates status', async () => {
  const a = await Appointment.findOne({ customerName: 'Alex Morgan' });
  const res = await request(app).patch(`/api/appointments/${a._id}/status`).send({ status: 'Confirmed' });
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('Confirmed');
});

test('rejects invalid status update and unknown id', async () => {
  const a = await Appointment.findOne();
  const bad = await request(app).patch(`/api/appointments/${a._id}/status`).send({ status: 'Done' });
  expect(bad.status).toBe(400);
  const missing = await request(app)
    .patch(`/api/appointments/${new mongoose.Types.ObjectId()}/status`)
    .send({ status: 'Pending' });
  expect(missing.status).toBe(404);
  const badId = await request(app).patch('/api/appointments/123/status').send({ status: 'Pending' });
  expect(badId.status).toBe(400);
});