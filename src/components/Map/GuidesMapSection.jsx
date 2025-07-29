import React from "react";
import MapComponent from "./MapComponent";

const GuidesMapSection = ({
  activeTab,
  guides,
  selectedLocation,
  selectedTags,
  setSelectedGuide,
  userCoords,
}) => {
  if (activeTab !== "map") return null;

  const mapKey = `${selectedLocation?.label}-${selectedTags
    .map((t) => t.value)
    .join(",")}`;

  const fallbackCenter = [38.7122, -9.134]; // e.g. Lisbon

  const center = selectedLocation?.value
    ? [selectedLocation.value.latitude, selectedLocation.value.longitude]
    : fallbackCenter;

  const userCoordinates = userCoords?.value || null;

  return (
    <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-2xl shadow-md border border-gray-100">
      <MapComponent
        key={`${mapKey}-${userCoords?.value?.latitude}-${userCoords?.value?.longitude}`}
        guides={guides}
        center={center}
        setSelectedGuide={setSelectedGuide}
        userCoords={userCoordinates}
      />
    </div>
  );
};

export default GuidesMapSection;
