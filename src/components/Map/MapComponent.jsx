import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const MapComponent = ({
  guides,
  center,
  userCoords,
  setSelectedGuide,
  setCurrentImageIndex,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {userCoords && (
        <Marker
          position={[userCoords.latitude, userCoords.longitude]}
          icon={
            new L.Icon({
              iconUrl:
                "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
            })
          }
        >
          <Popup>📍 You are here</Popup>
        </Marker>
      )}

      {guides.map((guide) => (
        <Marker
          key={guide.id}
          position={[guide.latitude, guide.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="relative">
              <div className="absolute top-0 right-0 text-right">
                <div className="flex flex-col text-xs text-gray-400 space-y-0.5">
                  <span className="whitespace-nowrap">
                    {guide.nrplays >= 1000
                      ? `${(guide.nrplays / 1000).toFixed(1)}K plays`
                      : `${guide.nrplays} plays`}
                  </span>
                  {guide.distance != null && (
                    <span className="whitespace-nowrap">
                      {guide.distance < 1000
                        ? `${guide.distance} m`
                        : `${(guide.distance / 1000).toFixed(1)} km`}
                    </span>
                  )}
                </div>
              </div>

              <h2
                onClick={() => {
                  setSelectedGuide?.(guide);
                  setCurrentImageIndex?.(0);
                }}
                className="text-lg font-semibold text-purple-700 cursor-pointer hover:underline pr-20"
              >
                {guide.title}
              </h2>

              <p className="text-xs text-gray-400">{guide.original_title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {guide.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {guide.guide && (
                <p className="mt-2 text-sm text-gray-700">
                  {guide.guide.split(" ").slice(0, 30).join(" ")}...
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
