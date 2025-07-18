# Web Code Challenge

A modern web application built with React frontend and serverless backend, featuring flight search functionality with drag-and-drop table capabilities.


## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for UI components
- React Query for data fetching and caching
- React Hook Form for form management
- Drag and Drop Kit for table interactions
- Day.js for date handling

### Backend
- Node.js with TypeScript
- Serverless Framework
- AWS Lambda functions
- Amadeus API integration for flight data
- Axios for HTTP requests

## 📦 Project Structure

```
web-code-challenge/
├── packages/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── services/      # API services
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   └── utils/         # Utility functions
│   │   └── package.json
│   └── backend/           # Serverless backend
│       ├── src/
│       │   ├── handlers/      # Lambda function handlers
│       │   └── services/      # Business logic services
│       └── package.json
├── .eslintrc.json         # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Root package.json with workspaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-code-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

rename .env.example to .env and enter your credentials 

4. Start the development servers:
```bash
# Start both frontend and backend (backend builds first)
npm run dev

# Or start them individually
npm run dev:frontend
npm run dev:backend  # Builds backend first, then starts dev server
```

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode (backend builds first)
- `npm run build` - Build both packages
- `npm run build:backend` - Build only the backend package
- `npm run build:frontend` - Build only the frontend package
- `npm run lint` - Run ESLint on all packages
- `npm run lint:fix` - Fix ESLint issues automatically

### Frontend
- `npm run start` - Start the React development server
- `npm run build` - Build the production bundle
- `npm run test` - Run tests

### Backend
- `npm run dev` - Start serverless offline
- `npm run build` - Compile TypeScript
- `npm run format` - Format code with Prettier

## 🔧 Code Quality

This project includes comprehensive code quality tools:

- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting for consistent style
- **TypeScript**: Static type checking
- **React Query ESLint Plugin**: Best practices for React Query

### Linting Rules
- No console.log statements in production code
- Consistent import ordering
- Proper React hooks usage
- TypeScript strict mode

## 🏗️ Architecture

### Frontend Architecture
- **Component-based**: Modular, reusable components
- **Hook-based**: Custom hooks for business logic
- **Type-safe**: Full TypeScript coverage
- **State Management**: React Query for server state, local state for UI

### Backend Architecture
- **Serverless**: AWS Lambda functions
- **Service Layer**: Business logic separation
- **API Integration**: Amadeus API for flight data
- **Error Handling**: Comprehensive error handling and logging


## 📚 API Documentation

### Flight Search Endpoints

#### GET /amadeus/flight-inspiration
Search for flight inspiration based on origin and departure date.

**Parameters:**
- `origin` (string): Origin airport/city code
- `departureDate` (string): Departure date in YYYY-MM-DD format

#### GET /amadeus/search-locations
Search for airports and cities by keyword.

**Parameters:**
- `keyword` (string): Search term
- `subType` (optional): Filter by type (AIRPORT, CITY, POINT_OF_INTEREST)
- `countryCode` (optional): ISO country code
- `page` (optional): Page number for pagination
