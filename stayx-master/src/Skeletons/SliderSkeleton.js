import React from "react";

const SliderSkeleton = () => {
  return (
    <div className="relative w-full h-80 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Large Image Skeleton */}
      <div className="absolute inset-0 h-full w-full bg-gray-300"></div>

      {/* Text Overlay Skeleton */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-60 p-4 rounded-lg shadow-md">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 w-32 mb-2 rounded-md"></div>
        {/* Location Skeleton */}
        <div className="h-4 bg-gray-300 w-24 mb-2 rounded-md"></div>
        {/* Price Skeleton */}
        <div className="h-4 bg-gray-300 w-20 rounded-md"></div>
      </div>
    </div>
  );
};

export default SliderSkeleton;
