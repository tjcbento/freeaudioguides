import React from "react";

const GuideModal = ({
  guide,
  media,
  currentImageIndex,
  isPlaying,
  onClose,
  onPrevImage,
  onNextImage,
  onTogglePlay,
}) => {
  if (!guide) return null;

  const { photos, audio } = media || {};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col">
      {/* Image Viewer */}
      <div className="relative flex-1 flex items-center justify-center bg-black rounded-b-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close guide"
          className="absolute top-4 right-4 w-10 h-10 text-white text-xl font-bold bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center"
        >
          &times;
        </button>

        {/* Left Arrow */}
        {photos?.length > 0 && (
          <button
            onClick={onPrevImage}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white text-2xl rounded-full flex items-center justify-center opacity-80"
          >
            ‹
          </button>
        )}

        {/* Right Arrow */}
        {photos?.length > 0 && (
          <button
            onClick={onNextImage}
            aria-label="Next image"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white text-2xl rounded-full flex items-center justify-center opacity-80"
          >
            ›
          </button>
        )}

        {/* Image Display */}
        {photos?.length > 0 ? (
          <img
            src={`http://localhost:3001${photos[currentImageIndex]}`}
            alt={`Guide image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="text-white text-center p-10">No images available</div>
        )}
      </div>

      {/* Info & Text */}
      <div
        className="p-6 bg-white overflow-y-auto"
        style={{ maxHeight: "40vh" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-purple-700">
              {guide.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {guide.original_title}
            </p>
          </div>
          <div className="flex flex-col text-sm text-gray-500 items-end">
            <span>
              {guide.nrplays >= 1000
                ? `${(guide.nrplays / 1000).toFixed(1)}K plays`
                : `${guide.nrplays} plays`}
            </span>
            {guide.distance && (
              <span>
                {guide.distance < 1000
                  ? `${guide.distance} m`
                  : `${(guide.distance / 1000).toFixed(1)} km`}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap mb-4 gap-2">
          {guide.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mb-4 space-x-4">
          <button
            onClick={() => {
              const lat = guide.latitude;
              const lng = guide.longitude;
              if (lat && lng) {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                window.open(mapsUrl, "_blank");
              }
            }}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition"
          >
            Navigate to Guide
          </button>

          {audio ? (
            <button
              onClick={onTogglePlay}
              className="flex-1 font-bold py-3 rounded-md text-white transition"
              style={{ backgroundColor: "#6B46C1" }}
            >
              {isPlaying ? "Pause Guide" : "Play Guide"}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 font-bold py-3 rounded-md text-white bg-purple-600 opacity-60 cursor-not-allowed"
            >
              No Audio Available
            </button>
          )}
        </div>

        {/* Guide Text */}
        <div className="text-gray-700 text-sm whitespace-pre-line">
          {guide.guide}
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
