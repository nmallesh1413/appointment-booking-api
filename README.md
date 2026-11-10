# Appointment Booking API

A Node.js + Express + MongoDB appointment booking backend with JWT authentication, provider role checks, slot management, booking logic, validation, tests, and Swagger docs.

## Prerequisites

- Node.js 18+
- npm
- MongoDB (or use the in-memory fallback for local testing)

## Install

```bash
npm install
```

## Environment setup

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/appointment_booking_db
JWT_SECRET=your_long_secret_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

If MongoDB is not installed locally, leave `MONGO_URI` empty and the app will use an in-memory MongoDB server for development/testing.

## Run the app

```bash
npm start
```

or:

```bash
npm run dev
```

## API base URL

```text
http://localhost:5000
```

## Swagger docs

```text
http://localhost:5000/api-docs
```

## Auth endpoints

### Register user

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Get current user

```http
GET /api/auth/me
Authorization: Bearer <token>
```

## Slot endpoints

### Get available slots

```http
GET /api/slots
```

### Create slot (provider only)

```http
POST /api/slots
Authorization: Bearer <provider_token>
```

Body:

```json
{
  "startTime": "2026-11-11T10:00:00.000Z",
  "endTime": "2026-11-11T11:00:00.000Z",
  "title": "Consultation",
  "price": 50
}
```

## Booking endpoints

### Book slot

```http
POST /api/bookings
Authorization: Bearer <user_token>
```

Body:

```json
{
  "slotId": "<slot_id>"
}
```

### Cancel booking

```http
POST /api/bookings/:id/cancel
Authorization: Bearer <user_token>
```

## Testing

```bash
npm test
```

The project includes Jest + Supertest tests covering:
- auth register/login
- provider role protection
- slot creation
- booking creation
- duplicate booking prevention
- booking cancellation
- available slot listing

