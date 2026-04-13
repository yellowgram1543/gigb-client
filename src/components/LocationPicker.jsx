import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for default Leaflet marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Bangalore default

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer center={position} zoom={13} className="h-full w-full grayscale contrast-125">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker />
      </MapContainer>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] badge-neo bg-surface-container-lowest py-2 px-4 shadow-[4px_4px_0px_0px_rgba(48,52,44,1)] whitespace-nowrap">
        CLICK GRID TO SET POSITION
      </div>
    </div>
  );
}
