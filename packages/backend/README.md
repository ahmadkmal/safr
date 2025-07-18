# Development Backend

This is a development backend for the web code challenge
## Architecture
- **Serverless Offline** for local development
- **Lambda-style handlers** for API endpoints
- **Standalone services** for business logic

## Functions

### Amadeus API Integration
- **Token**: `GET /amadeus/token`
- **Flight Inspiration**: `GET /amadeus/flight-inspiration`
- **Search Locations**: `GET /amadeus/search-locations`
- **Handler**: `src/handlers/amadeus.ts`


## Development

### Prerequisites

- Node.js 18+
- Amadeus API credentials

### Install Dependencies

```bash
npm install
```

### Local Development

```bash
npm run dev
# or
npm start
```

This starts the serverless offline server on port 3001.

### Build

```bash
npm run build
```

## API Endpoints


### Get Amadeus Token
```bash
curl http://localhost:3001/amadeus/token
```

### Flight Inspiration Search
```bash
curl "http://localhost:3001/amadeus/flight-inspiration?origin=NYC&departureDate=2024-01-15"
```

### Search Locations
```bash
curl "http://localhost:3001/amadeus/search-locations?keyword=New%20York"
```
### File Structure

```
src/
|
handler
│   └── amadeus.ts         # Amadeus API handlers
└── services/
    └── amadeus.service.ts # Amadeus API
```
