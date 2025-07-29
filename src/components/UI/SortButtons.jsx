import React from "react";

const SortControls = ({ sortBy, setSortBy }) => {
  return (
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
  );
};

export default SortControls;
