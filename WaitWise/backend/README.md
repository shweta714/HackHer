# WaitWise Backend

This folder is reserved for the backend teammates (Node.js / Express / Python FastAPI / Socket.IO).

### Recommended API Endpoints to implement:
- `GET /api/locations` - List all facilities, counters, and live queue status.
- `GET /api/locations/:id` - Facility details and services.
- `POST /api/queue/join` - Add customer to virtual queue and generate token.
- `GET /api/queue/my-tokens?phone=...` - Retrieve active tokens by phone or device ID.
- `POST /api/queue/call-next` - Counter staff advances queue, triggers WebSocket event.
- `POST /api/queue/serve` - Mark token as served/completed.
- `POST /api/queue/skip` - Mark token as missed/no-show.
- `GET /api/analytics` - Aggregated SLA and throughput telemetry.

### WebSocket / Socket.IO Events:
- `emit('queue_updated', { locationId, serviceId, tokenNumber })`
- `emit('token_called', { tokenNumber, counterName })`
