import React from "react";

const CardSkeleton = () => {
  const skeletonItems = [];
  for (let i = 0; i < 6; i++) {
    skeletonItems.push(
      <div key={i} className="bg-white p-4 rounded-lg shadow-lg">
        {/* Price Badge Skeleton */}
        <div className="h-8 bg-gray-300 w-28 rounded-md mb-4"></div>
        {/* Image Skeleton */}
        <div className="h-40 bg-gray-300 w-full rounded-md mb-4"></div>
        {/* Property Title Skeleton */}
        <div className="h-6 bg-gray-300 w-32 rounded-md mb-2"></div>
        {/* Location Skeleton */}
        <div className="h-4 bg-gray-300 w-28 rounded-md mb-4"></div>
        {/* Icons Skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Beds, Baths, Area Icons */}
            <div className="h-4 bg-gray-300 w-12 rounded-md"></div>
            <div className="h-4 bg-gray-300 w-12 rounded-md"></div>
            <div className="h-4 bg-gray-300 w-12 rounded-md"></div>
          </div>
          {/* Like Icon */}
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 px-6 mx-auto max-w-7xl">
      {skeletonItems}
    </div>
  );
};

export default CardSkeleton;
