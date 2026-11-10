# Register provider
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "password": "password123",
    "role": "provider"
  }'

# Login provider
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "smith@example.com",
    "password": "password123"
  }'

# Create slot (copy provider token from login response)
curl -X POST http://localhost:5000/api/slots \
  -H "Authorization: Bearer YOUR_PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2026-11-12T09:00:00.000Z",
    "endTime": "2026-11-12T10:00:00.000Z",
    "title": "Consultation",
    "price": 100
  }'

# List available slots
curl -X GET http://localhost:5000/api/slots

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get my bookings
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_USER_TOKEN"

# Book slot (copy slotId from GET /api/slots response)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "YOUR_SLOT_ID"
  }'

# Cancel booking (copy bookingId from booking response)
curl -X POST http://localhost:5000/api/bookings/YOUR_BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_USER_TOKEN"

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_USER_TOKEN"

