import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

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

export default function TaskMap({ tasks }) {
  const navigate = useNavigate();
  
  // Default to a central point (e.g., center of a city) if no tasks exist
  const center = tasks.length > 0 
    ? [tasks[0].location.lat, tasks[0].location.lng] 
    : [12.9716, 77.5946]; // Default to Bangalore coordinates

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", border: "var(--border-thick)" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {tasks.map((task) => (
          <Marker 
            key={task._id} 
            position={[task.location.lat, task.location.lng]}
          >
            <Popup>
              <div style={{ padding: "5px" }}>
                <h3 style={{ margin: "0 0 5px" }}>{task.title}</h3>
                <p style={{ margin: "0 0 10px", fontWeight: 700, color: "var(--color-primary)" }}>₹{task.budget}</p>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                  onClick={() => navigate(`/task/${task._id}`)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
