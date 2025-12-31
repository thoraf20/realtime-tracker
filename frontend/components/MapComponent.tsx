'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const socket = io('http://localhost:3000'); // Backend URL

interface Driver {
  driverId: string;
  lat: number;
  lng: number;
}


export default function MapComponent() {
  const [drivers, setDrivers] = useState<Record<string, Driver>>({});
  const [requesting, setRequesting] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState<any>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('driverMoved', (data: Driver) => {
      setDrivers((prev) => ({
        ...prev,
        [data.driverId]: data,
      }));
    });

    // Listen for Trip Updates
    socket.on('tripUpdate', (trip: any) => {
      if (matchedDriver && matchedDriver.driverId === trip.driverId) {
        setMatchedDriver((prev: any) => ({ ...prev, status: trip.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [matchedDriver]); // Re-bind if matchedDriver changes (simple implementation)



  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'Driver is on the way';
      case 'DRIVER_AT_PICKUP': return 'Driver has arrived!';
      case 'IN_PROGRESS': return 'Trip in progress';
      case 'COMPLETED': return 'Trip completed';
      default: return 'Finding driver...';
    }
  };

  const handleRequestRide = async () => {
    setRequesting(true);
    setMatchedDriver(null);
    try {
      // Updated to use the Trip API (Persistent)
      const res = await fetch('http://localhost:3000/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: 51.505,
          pickupLng: -0.09
        }), // Demo center
      });
      const trip = await res.json();

      // The trip object contains driverId and status
      // For the UI, we just need to confirm a driver was assigned
      setMatchedDriver({
        driverId: trip.driverId,
        distance: 'Arriving soon...', // We'd need a separate calculation or response field for distance
        status: trip.status
      });
    } catch (e) {
      console.error(e);
      alert('Error requesting ride');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(drivers).map((driver) => (
          <Marker key={driver.driverId} position={[driver.lat, driver.lng]}>
            <Popup>
              <div className="text-sm font-semibold">Driver: {driver.driverId}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* UI Overlay */}
      <div className="absolute bottom-8 left-0 right-0 px-4 md:px-0 flex justify-center z-[1000] pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md dark:bg-black/90 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 transition-all">

          {!matchedDriver ? (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Where to?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Request a ride to see the nearest driver.</p>
              <button
                onClick={handleRequestRide}
                disabled={requesting}
                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {requesting ? (
                  <>Finding Driver...</>
                ) : (
                  <>Request Ride</>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{getStatusMessage(matchedDriver.status)}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 capitalize">{matchedDriver.driverId}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{matchedDriver.distance}</p>
                  <p className="text-xs text-gray-500">away</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setMatchedDriver(null)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-blue-500/30 shadow-lg">
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
