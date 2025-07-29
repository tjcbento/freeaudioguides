import React from "react";
import GuideCard from "./GuideCard";

const GuideList = ({ guides, onSelect }) => {
  if (!guides || guides.length === 0) {
    return <div>No guides found near you.</div>;
  }

  return (
    <div className="space-y-4">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          guide={guide}
          onSelect={() => onSelect(guide)}
        />
      ))}
    </div>
  );
};

export default GuideList;
