const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User");
const Slot = require("../src/models/Slot");
const Booking = require("../src/models/Booking");

const { generateToken } = require("../src/controllers/authController");

const start = new Date(Date.now() + 60 * 60 * 1000);
const end = new Date(start.getTime() + 60 * 60 * 1000);

describe("Appointment Booking API", () => {
  let providerToken;
  let userToken;
  let providerId;
  let userId;
  let slotId;
  let bookingId;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    await User.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});

    const provider = await User.create({
      name: "Provider One",
      email: "provider@test.com",
      password: "password123",
      role: "provider",
    });

    const user = await User.create({
      name: "Normal User",
      email: "user@test.com",
      password: "password123",
      role: "user",
    });

    providerId = provider._id.toString();
    userId = user._id.toString();
    providerToken = generateToken(provider);
    userToken = generateToken(user);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("POST /api/auth/register creates a user and returns a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "New User",
        email: "newuser@test.com",
        password: "password123",
        role: "user",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe("newuser@test.com");
  });

  test("POST /api/auth/login authenticates an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTruthy();
  });

  test("POST /api/slots creates a slot when provider is authenticated", async () => {
    const res = await request(app)
      .post("/api/slots")
      .set("Authorization", `Bearer ${providerToken}`)
      .send({
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        title: "Consultation",
        price: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    slotId = res.body.data._id;
  });

  test("POST /api/slots rejects a non-provider from creating a slot", async () => {
    const res = await request(app)
      .post("/api/slots")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/bookings books an available slot for a user", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ slotId });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    bookingId = res.body.data._id;
  });

  test("POST /api/bookings rejects double-booking the same slot", async () => {
    const secondUser = await User.create({
      name: "Second User",
      email: "seconduser@test.com",
      password: "password123",
      role: "user",
    });

    const secondUserToken = generateToken(secondUser);

    const res = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${secondUserToken}`)
      .send({ slotId });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/bookings/:id/cancel cancels a booking and frees the slot", async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const slot = await Slot.findById(slotId);
    expect(slot.status).toBe("available");
  });

  test("GET /api/slots returns available slots", async () => {
    const res = await request(app).get("/api/slots");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
