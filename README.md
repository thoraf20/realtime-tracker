# Real-Time Ride Hailing Tracker

A real-time ride-hailing tracking application demonstrating advanced full-stack concepts including WebSocket bi-directional communication, geospatial data handling, and event-driven architecture.

## Overview

This project simulates a ride-hailing experience where users can request rides and see drivers moving in real-time on a map. It efficiently handles high-frequency updates using Redis and WebSockets.

### Key Features
- **Real-Time Driver Tracking**: Drivers' locations update live on the map without refreshing.
- **Geospatial Matching**: Finds the nearest available driver to the pickup location.
- **Event-Driven Updates**: Uses WebSockets to push state changes (Ride Accepted, Driver at Pickup, etc.) to the client instantly.
- **Simulation Scripts**: Includes a script to simulate driver movement and behavior for testing.

## Tech Stack

### Backend
- **NestJS**: Progressive Node.js framework for scalable server-side applications.
- **Redis**: In-memory data store used for geospatial indexing (`GEOADD`, `GEORADITUS`) and pub/sub.
- **Socket.io**: Enables real-time, bi-directional communication between web clients and servers.
- **SQLite**: Lightweight SQL database for persisting trip and transaction data (via TypeORM).

### Frontend
- **Next.js**: React framework for production-grade web applications.
- **Leaflet / React-Leaflet**: Open-source JavaScript library for interactive maps.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

## Architecture

1.  **Client (Next.js)**: Connects to the WebSocket Gateway and listens for `driverMoved` and `tripUpdate` events.
2.  **Dispatcher Service**: Handles ride requests, queries Redis for nearby drivers, and manages trip state.
3.  **Redis**: Stores ephemeral driver locations and supports fast geospatial queries.
4.  **Driver Simulation**: A script mimicking multiple drivers moving across the map and responding to job assignments.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Redis Server (Running locally or remotely)
- NPM or Yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/thoraf20/realtime-tracker.git
    cd realtime-tracker
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Update REDIS_URL in .env if needed
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend**
    ```bash
    cd backend
    npm run start:dev
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:3001` (or usually 3000/3001 depending on port availability).

3.  **Simulate Drivers**
    To see the real-time tracking in action, run the driver simulation script:
    ```bash
    cd backend
    npx ts-node scripts/simulate_drivers.ts
    ```
    You should see drivers appearing and moving on the map!

## License

This project is licensed under the MIT License.
