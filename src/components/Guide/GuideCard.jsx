import React from "react";

const GuideCard = ({ guide, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(guide);
  };

  return (
    <div
      className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-purple-700 hover:underline">
            {guide.title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {guide.original_title}
          </p>
        </div>
        <div className="flex flex-col text-xs text-gray-400 space-y-0.5 text-right">
          <span>
            {guide.nrplays >= 1000
              ? `${(guide.nrplays / 1000).toFixed(1)}K plays`
              : `${guide.nrplays} plays`}
          </span>
          {guide.distance != null && (
            <span>
              {guide.distance < 1000
                ? `${guide.distance} m`
                : `${(guide.distance / 1000).toFixed(1)} km`}
            </span>
          )}
        </div>
      </div>

      {guide.tags?.length > 0 && (
        <div className="flex mt-2 space-x-2 overflow-hidden whitespace-nowrap">
          {guide.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold select-none shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {guide.guide && (
        <p className="mt-2 text-gray-700 text-sm line-clamp-3">
          {guide.guide}
        </p>
      )}
    </div>
  );
};

export default GuideCard;
