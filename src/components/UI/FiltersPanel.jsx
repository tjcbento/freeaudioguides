import React from "react";
import Select from "react-select";

const FiltersPanel = ({
  selectedLocation,
  setSelectedLocation,
  locationsList,
  locationInput,
  handleLocationInputChange,
  selectedTags,
  setSelectedTags,
  tagsList,
}) => {
  return (
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
              locationInput ? "No locations found" : "Type to search locations"
            }
            className="flex-grow text-sm"
          />
        </div>

        {/* Tags Selector */}
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
  );
};

export default FiltersPanel;
