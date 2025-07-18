# Development Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   export AMADEUS_CLIENT_ID=your_client_id
   export AMADEUS_CLIENT_SECRET=your_client_secret
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

## What Changed

### Before (NestJS)
- Traditional Express server
- NestJS decorators and modules
- Complex dependency injection

### After (Development Backend)
- Serverless offline for local development
- Simple Lambda-style handlers
- Standalone service classes
- No AWS deployment needed

## API Endpoints

All endpoints work the same as before:

- `GET http://localhost:3001/health` - Health check
- `GET http://localhost:3001/amadeus/token` - Get Amadeus token
- `GET http://localhost:3001/amadeus/flight-inspiration?origin=NYC&departureDate=2024-01-15` - Flight search
- `GET http://localhost:3001/amadeus/search-locations?keyword=New%20York` - Location search

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build TypeScript
npm run lint     # Lint code
npm run format   # Format code
```

## File Structure

```
src/
├── handlers/           # API endpoints (Lambda-style)
│   ├── health.ts      # Health check
│   └── amadeus.ts     # Amadeus API endpoints
└── services/          # Business logic
    └── amadeus.service.ts
```

## Benefits

- ✅ **Simple**: Just run `npm run dev`
- ✅ **Fast**: No complex setup required
- ✅ **Consistent**: Same API as before