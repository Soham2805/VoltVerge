# VoltVerge - EV Charging Station Finder

A full-stack application for finding and booking EV charging stations across Maharashtra, with a Next.js frontend and Django backend.

## Project Structure

The project consists of two main parts:

1. **Frontend**: Next.js application with React components
2. **Backend**: Django REST API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`
   cd backend
   \`\`\`

2. Create a virtual environment:
   \`\`\`
   python -m venv venv
   \`\`\`

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

5. Run migrations:
   \`\`\`
   python manage.py migrate
   \`\`\`

6. Create a superuser:
   \`\`\`
   python manage.py createsuperuser
   \`\`\`

7. Start the Django server:
   \`\`\`
   python manage.py runserver
   \`\`\`

### Frontend Setup

1. Navigate to the root directory

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env.local` file with:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   \`\`\`

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Features

- Interactive map for finding charging stations
- Real-time availability of charging stations
- Advanced filtering options
- User authentication and profiles
- Booking management
- Admin dashboard for station management
- Responsive design for all devices

## Technologies Used

### Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui components
- Leaflet for maps
- Axios for API requests

### Backend
- Django
- Django REST Framework
- Simple JWT for authentication
- SQLite (development) / PostgreSQL (production)

## API Endpoints

### Authentication
- `POST /api/token/`: Get JWT tokens
- `POST /api/token/refresh/`: Refresh JWT token

### Stations
- `GET /api/stations/`: List all stations
- `GET /api/stations/nearby/`: Get nearby stations
- `GET /api/stations/{id}/`: Get station details
- `POST /api/stations/`: Create a station (admin only)
- `PUT /api/stations/{id}/`: Update a station (admin only)
- `DELETE /api/stations/{id}/`: Delete a station (admin only)

### Users
- `GET /api/users/me/`: Get current user
- `POST /api/users/`: Register a new user
- `GET /api/users/vehicles/`: List user vehicles
- `POST /api/users/vehicles/`: Add a vehicle

### Bookings
- `GET /api/bookings/`: List user bookings
- `POST /api/bookings/`: Create a booking
- `GET /api/bookings/{id}/`: Get booking details
- `POST /api/bookings/{id}/cancel/`: Cancel a booking
