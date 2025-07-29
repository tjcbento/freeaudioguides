import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GuideList from "../components/Guide/GuideList";
import GuideModal from "../components/Guide/GuideModal";
import GuidesMapSection from "../components/Map/GuidesMapSection";
import FiltersPanel from "../components/UI/FiltersPanel";
import SortControls from "../components/UI/SortButtons";

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
  const [guides, setGuides] = useState(null);
  const [error, setError] = useState(null);
  const language = localStorage.getItem("language") || "en";
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
        setSelectedLocation(coords);
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
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
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
    ? (guides ?? []).filter((guide) =>
        selectedTags.every((tag) => guide.tags.includes(tag.value))
      )
    : guides ?? [];

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
        <FiltersPanel
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locationsList={locationsList}
          locationInput={locationInput}
          handleLocationInputChange={handleLocationInputChange}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          tagsList={tagsList}
        />

        {/* Content */}
        {/* No output while loading */}
        {activeTab === "list" && !error && guides === null && (
          <div className="text-center p-6 text-gray-500">Loading guides...</div>
        )}

        {activeTab === "list" &&
          !error &&
          guides !== null &&
          guides.length === 0 && <div>No guides found near you.</div>}

        {activeTab === "list" && !error && guides && guides.length > 0 && (
          <div className="space-y-4">
            <SortControls sortBy={sortBy} setSortBy={setSortBy} />
            <GuideList
              guides={sortedGuides}
              onSelect={(guide) => {
                setSelectedGuide(guide);
                setCurrentImageIndex(0);
              }}
            />
          </div>
        )}

        {activeTab === "map" && (
          <GuidesMapSection
            activeTab={activeTab}
            guides={guides}
            selectedLocation={selectedLocation}
            selectedTags={selectedTags}
            setSelectedGuide={setSelectedGuide}
            userCoords={userCoords}
          />
        )}
      </main>

      {/* Modal Overlay for full guide */}
      {selectedGuide && (
        <GuideModal
          guide={selectedGuide}
          media={media}
          currentImageIndex={currentImageIndex}
          isPlaying={isPlaying}
          onClose={() => setSelectedGuide(null)}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onTogglePlay={togglePlay}
        />
      )}
    </div>
  );
};

export default GuidesPage;
