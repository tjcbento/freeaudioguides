import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

export const MapComponent = ({
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
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
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
              {/* Top-right corner info */}
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
                  setSelectedGuide(guide);
                  setCurrentImageIndex(0);
                }}
                className="text-lg font-semibold text-purple-700 cursor-pointer hover:underline pr-20"
              >
                {guide.title}
              </h2>

              <p className="text-xs text-gray-400">
                {guide.original_title}
              </p>
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

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const GuidesPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [location, setLocation] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, _] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [tagsList, setTagsList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    label: "📍 Near me",
    value: null,
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [locationInput, setLocationInput] = useState(""); // Controlled input value
  const [locationsList, setLocationsList] = useState([]);

  // Modal state
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [media, setMedia] = useState({ photos: [], audio: null });

  // Audio play state and ref
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Fetch locations from backend
  const userCoordsRef = useRef(userCoords);

  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  const fetchLocations = useRef(
    debounce(async (input) => {
      const nearMeOption = {
        label: "📍 Near me",
        value: userCoordsRef.current ? userCoordsRef.current.value : null,
      };

      try {
        if (!input) {
          setLocationsList([nearMeOption]);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/locations?location=${encodeURIComponent(
            input
          )}`
        );

        const options = response.data.map((loc) => ({
          label: loc.city || loc.name,
          value: {
            latitude: parseFloat(loc.coordinates.split(",")[0]),
            longitude: parseFloat(loc.coordinates.split(",")[1]),
          },
        }));

        setLocationsList([nearMeOption, ...options]);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationsList([nearMeOption]);
      }
    }, 300)
  );

  // When user types in the location select input
  function handleLocationInputChange(inputValue, { action }) {
    if (action === "input-change") {
      setLocationInput(inputValue);
      fetchLocations.current(inputValue);
    }
  }

  // Fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          label: "📍 Near me",
          value: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        };
        setUserCoords(coords);
        setSelectedLocation(coords); // Optionally set as default
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setUserCoords(null);
      }
    );
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/tags?language=${language}`
        );
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        setTagsList(
          data.tags.map((tag) => ({
            label: tag,
            value: tag,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        setTagsList([]);
      }
    };

    fetchTags();
  }, [language]);

  useEffect(() => {
    fetch("http://localhost:3001/locations")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((loc) => ({
          label: loc.name,
          value: { latitude: loc.latitude, longitude: loc.longitude },
        }));
        setLocationsList([{ label: "📍 Near me", value: null }, ...formatted]);
      })
      .catch((err) => console.error("Failed to load locations", err));

    fetch("http://localhost:3001/tags")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((tag) => ({ label: tag, value: tag }));
        setTagsList(formatted);
      })
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => setError("Location permission denied")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  // Fetch guides when location changes
  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);

    const { latitude, longitude } = selectedLocation.value || location || {};
    if (!latitude || !longitude) return;

    fetch(
      `http://localhost:3001/guides?latitude=${latitude}&longitude=${longitude}&language=${language.toUpperCase()}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch guides");
        return res.json();
      })
      .then((data) => {
        setGuides(data.guides);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [language, location, selectedLocation.value]);

  // Fetch media (photos + audio) when a guide is selected
  useEffect(() => {
    if (!selectedGuide) {
      setMedia({ photos: [], audio: null });
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    fetch(`http://localhost:3001/media/${selectedGuide.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch media");
        return res.json();
      })
      .then((data) => {
        setMedia({
          photos: data.photos || [],
          audio: data.audio || null,
        });
        setCurrentImageIndex(0);
        setIsPlaying(false);
      })
      .catch((err) => {
        console.error("Error loading media:", err);
        setMedia({ photos: [], audio: null });
        setIsPlaying(false);
      });
  }, [selectedGuide]);

  // Initialize audio when media.audio changes
  useEffect(() => {
    if (media.audio) {
      audioRef.current = new Audio(`http://localhost:3001${media.audio}`);
      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    }

    // Cleanup when media.audio changes or on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [media.audio]);

  // Handlers for swipe left/right in modal images
  function prevImage() {
    if (!media.photos.length) return;
    setCurrentImageIndex((idx) =>
      idx === 0 ? media.photos.length - 1 : idx - 1
    );
  }
  function nextImage() {
    if (!media.photos.length) return;
    setCurrentImageIndex((idx) =>
      idx === media.photos.length - 1 ? 0 : idx + 1
    );
  }

  // Function to increment play count on backend and update local state
  async function incrementPlayCount(guideId) {
    try {
      const res = await fetch(`http://localhost:3001/guides/${guideId}/play`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to increment play count");
    } catch (error) {
      console.error("Error incrementing play count:", error);
    }
  }

  // Toggle play/pause audio
  function togglePlay() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (selectedGuide) {
        incrementPlayCount(selectedGuide.id);
      }
    }
  }

  const filteredGuides = selectedTags.length
    ? guides.filter((guide) =>
        selectedTags.every((tag) => guide.tags.includes(tag.value))
      )
    : guides;

  const [sortBy, setSortBy] = useState("closest");

  // Sort guides by selected criteria
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    if (sortBy === "closest") {
      // Sort ascending by distance (handle missing distance)
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    }
    if (sortBy === "popularity") {
      // Sort descending by nrplays
      return (b.nrplays ?? 0) - (a.nrplays ?? 0);
    }
    return 0;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-gray-900 font-sans">
      <main className="flex-1 pt-8 overflow-y-auto">
        <div className="flex justify-around items-end h-26 pt-6 pb-2 border-b border-gray-200 bg-white">
          <button
            className={`flex flex-col items-center px-4 py-1 text-sm font-medium transition-colors duration-200 ${
              activeTab === "list"
                ? "text-purple-700 border-b-2 border-purple-600"
                : "text-gray-400 hover:text-purple-500"
            }`}
            onClick={() => setActiveTab("list")}
          >
            <div className="text-2xl select-none mt-2">📋</div>
            <span className="mt-1">List</span>
          </button>
          <button
            className={`flex flex-col items-center px-4 py-1 text-sm font-medium transition-colors duration-200 ${
              activeTab === "map"
                ? "text-purple-700 border-b-2 border-purple-600"
                : "text-gray-400 hover:text-purple-500"
            }`}
            onClick={() => setActiveTab("map")}
          >
            <div className="text-2xl select-none mt-2">🗺️</div>
            <span className="mt-1">Map</span>
          </button>
        </div>
        <div className="px-4 pt-6 mb-4 space-y-2">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Location Selector */}
            <div className="flex items-center flex-1 z-10">
              <label
                htmlFor="location-select"
                className="w-24 text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <Select
                inputId="location-select"
                options={locationsList}
                value={selectedLocation}
                filterOption={() => true}
                onChange={setSelectedLocation}
                onInputChange={handleLocationInputChange}
                placeholder="Search location..."
                noOptionsMessage={() =>
                  locationInput
                    ? "No locations found"
                    : "Type to search locations"
                }
                className="flex-grow text-sm"
              />
            </div>

            {/* Tags */}
            <div className="flex items-center flex-1">
              <label
                htmlFor="tags-select"
                className="w-24 text-sm font-medium text-gray-700"
              >
                Tags
              </label>
              <Select
                inputId="tags-select"
                isMulti
                options={tagsList}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder="Filter by tags..."
                className="flex-grow text-sm"
              />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {activeTab === "list" && (
            <>
              {loading ? (
                <div>Loading guides...</div>
              ) : error ? (
                <div className="text-red-500 mb-4">{error}</div>
              ) : guides.length === 0 ? (
                <div>No guides found near you.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end px-4 py-2 border-b border-gray-200">
                    <div
                      className="inline-flex rounded-md shadow-sm"
                      role="group"
                      aria-label="Sort by options"
                    >
                      <button
                        type="button"
                        onClick={() => setSortBy("closest")}
                        className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md focus:z-10 focus:outline-none ${
                          sortBy === "closest"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Closest
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy("popularity")}
                        className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:z-10 focus:outline-none ${
                          sortBy === "popularity"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Popularity
                      </button>
                    </div>
                  </div>

                  {sortedGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2
                            onClick={() => {
                              setSelectedGuide(guide);
                              setCurrentImageIndex(0);
                            }}
                            className="text-lg font-semibold text-purple-700 cursor-pointer hover:underline"
                          >
                            {guide.title}
                          </h2>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {guide.original_title}
                          </p>
                        </div>
                        <div className="flex flex-col text-xs text-gray-400 space-y-0.5">
                          <span className="whitespace-nowrap">
                            {guide.nrplays >= 1000
                              ? `${(guide.nrplays / 1000).toFixed(1)}K plays`
                              : `${guide.nrplays} plays`}
                          </span>
                          {guide.distance && (
                            <span className="whitespace-nowrap">
                              {" "}
                              {guide.distance < 1000
                                ? `${guide.distance} m`
                                : `${(guide.distance / 1000).toFixed(1)} km`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex mt-2 space-x-2 overflow-hidden whitespace-nowrap">
                        {(guide.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold select-none shrink-0"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                        {guide.guide}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {activeTab === "map" && (
          <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-2xl shadow-md border border-gray-100">
            <MapComponent
              key={`${selectedLocation?.label}-${selectedTags
                .map((t) => t.value)
                .join(",")}`}
              guides={guides}
              center={
                selectedLocation?.value
                  ? [
                      selectedLocation.value.latitude,
                      selectedLocation.value.longitude,
                    ]
                  : [38.7122, -9.134] // fallback center (e.g., Lisbon)
              }
              setSelectedGuide={setSelectedGuide}
              userCoords={
                selectedLocation?.label === "📍 Near me" && userCoords?.value
                  ? userCoords.value
                  : null
              }
            />
          </div>
        )}
      </main>

      {/* Modal Overlay for full guide */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col">
          {/* Image carousel container with relative position */}
          <div className="relative flex-1 flex items-center justify-center bg-black rounded-b-none">
            {/* Close button */}
            <button
              onClick={() => setSelectedGuide(null)}
              aria-label="Close guide"
              style={{
                backgroundColor: "#6B46C1",
                color: "white",
                fontWeight: "700",
                borderRadius: "9999px",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "16px",
                right: "16px",
                cursor: "pointer",
                border: "none",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#553C9A")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#6B46C1")
              }
            >
              &times;
            </button>

            {/* Left arrow */}
            <button
              onClick={prevImage}
              aria-label="Previous image"
              style={{
                backgroundColor: "#6B46C1",
                color: "white",
                fontWeight: "700",
                borderRadius: "9999px",
                width: "48px",
                height: "48px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                border: "none",
                opacity: 0.8,
                fontSize: "28px",
                lineHeight: "1",
                userSelect: "none",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              ‹
            </button>

            {/* Right arrow */}
            <button
              onClick={nextImage}
              aria-label="Next image"
              style={{
                backgroundColor: "#6B46C1",
                color: "white",
                fontWeight: "700",
                borderRadius: "9999px",
                width: "48px",
                height: "48px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                border: "none",
                opacity: 0.8,
                fontSize: "28px",
                lineHeight: "1",
                userSelect: "none",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              ›
            </button>

            {media.photos.length > 0 ? (
              <img
                src={`http://localhost:3001${media.photos[currentImageIndex]}`}
                alt={`Guide image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="text-white text-center p-10">
                No images available
              </div>
            )}
          </div>

          {/* Info & Guide text */}
          <div
            className="p-6 bg-white overflow-y-auto rounded-t-none"
            style={{ maxHeight: "40vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-purple-700">
                  {selectedGuide.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedGuide.original_title}
                </p>
              </div>
              <div className="flex flex-col text-sm text-gray-500 items-end whitespace-nowrap">
                <span>
                  {" "}
                  {selectedGuide.nrplays >= 1000
                    ? `${(selectedGuide.nrplays / 1000).toFixed(1)}K plays`
                    : `${selectedGuide.nrplays} plays`}
                </span>
                {selectedGuide.distance && (
                  <span>
                    {" "}
                    {selectedGuide.distance < 1000
                      ? `${selectedGuide.distance} m`
                      : `${(selectedGuide.distance / 1000).toFixed(1)} km`}
                  </span>
                )}
              </div>
            </div>

            {/* Tags inside modal */}
            {selectedGuide.tags && selectedGuide.tags.length > 0 && (
              <div className="flex flex-wrap mb-4 space-x-2">
                {selectedGuide.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 mb-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between mb-4 space-x-4">
              <button
                onClick={() => {
                  const lat = selectedGuide.latitude;
                  const lng = selectedGuide.longitude;
                  if (lat && lng) {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                    window.open(mapsUrl, "_blank");
                  } else {
                    alert("Location not available");
                  }
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition-colors duration-300"
              >
                Navigate to Guide
              </button>

              {media.audio ? (
                <button
                  onClick={togglePlay}
                  className="flex-1 font-bold py-3 rounded-md text-white transition duration-300"
                  style={{
                    backgroundColor: "#6B46C1",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#5A3AAE")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#6B46C1")
                  }
                  aria-label={
                    isPlaying ? "Pause audio guide" : "Play audio guide"
                  }
                >
                  {isPlaying ? "Pause Guide" : "Play Guide"}
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    backgroundColor: "#6B46C1",
                    color: "white",
                    opacity: 0.6,
                  }}
                  className="flex-1 font-bold py-3 rounded-md transition-colors duration-300 cursor-not-allowed"
                >
                  No Audio Available
                </button>
              )}
            </div>

            <div className="text-gray-700 text-sm whitespace-pre-line">
              {selectedGuide.guide}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidesPage;
