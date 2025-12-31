import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const DRIVER_COUNT = 5;
const BASE_LAT = 51.505;
const BASE_LNG = -0.09;

const drivers = Array.from({ length: DRIVER_COUNT }, (_, i) => ({
  driverId: `driver-${i + 1}`,
  lat: BASE_LAT + (Math.random() - 0.5) * 0.05,
  lng: BASE_LNG + (Math.random() - 0.5) * 0.05,
  direction: Math.random() * 2 * Math.PI,
}));

socket.on('connect', () => {
  console.log('Connected to server!');
  
  setInterval(() => {
    drivers.forEach((driver) => {
      // Move driver
      driver.lat += Math.cos(driver.direction) * 0.0001;
      driver.lng += Math.sin(driver.direction) * 0.0001;

      // Randomly change direction slightly
      driver.direction += (Math.random() - 0.5) * 0.5;

      // Emit update
      socket.emit('updateLocation', {
        driverId: driver.driverId,
        lat: driver.lat,
        lng: driver.lng,
      });
    });
    console.log(`Updated ${DRIVER_COUNT} drivers`);
  }, 1000);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
