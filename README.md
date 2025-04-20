# Lab Management System Backend

This is the backend service for the Lab Management System. It provides APIs for managing student assessments, experiments, and other lab-related functionalities.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   # Database Configuration
   DB_NAME=lab_management
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432

   # JWT Configuration
   JWT_SECRET=your-secret-key

   # Server Configuration
   PORT=3000
   ```
4. Create the database:
   ```bash
   createdb lab_management
   ```
5. Run migrations:
   ```bash
   npm run migrate
   ```

## Development

To start the development server:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## License

MIT 