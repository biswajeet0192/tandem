// components/Map.js
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useMemo } from 'react';

const Map = ({ coordinates }) => {
  if (coordinates.length === 0) return null;
  const position = coordinates[coordinates.length - 1];

  const polylinePositions = useMemo(() => coordinates.map(coord => [coord.lat, coord.lng]), [coordinates]);

  return (
    <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[position.lat, position.lng]} />
      <Polyline positions={polylinePositions} />'use client';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useMemo } from 'react';

const Map = ({ coordinates }) => {
  const hasCoordinates = coordinates.length > 0;

  // Memoize the polyline positions unconditionally
  const polylinePositions = useMemo(() => {
    return coordinates.map(coord => [coord.lat, coord.lng]);
  }, [coordinates]);

  // Early return after memoizing to ensure hooks are called
  if (!hasCoordinates) return null;

  const position = coordinates[coordinates.length - 1];
  

  return (
    <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[position.lat, position.lng]} />
      <Polyline positions={polylinePositions} />
    </MapContainer>
  );
};

export default React.memo(Map);
    </MapContainer>
  );
};

export default React.memo(Map);
