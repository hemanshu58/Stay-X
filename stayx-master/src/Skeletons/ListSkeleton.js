import React from "react";

const ListSkeleton = () => {
  const skeletonItems = [];
  for (let i = 0; i < 3; i++) {
    skeletonItems.push(
      <div key={i} className="flex items-center p-4 bg-white rounded-lg shadow-lg mb-6">
        {/* Image Skeleton */}
        <div className="h-24 w-40 bg-gray-300 rounded-md mr-4"></div>
        {/* Text Skeleton */}
        <div className="flex-1">
          <div className="h-6 bg-gray-300 w-32 mb-2 rounded-md"></div>
          <div className="h-4 bg-gray-300 w-24 rounded-md"></div>
        </div>
        {/* Heart Icon Skeleton */}
        <div className="flex items-center ml-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-300 w-10 rounded-md"></div>
        </div>
        {/* Edit and Delete Icon Skeleton */}
        <div className="flex items-center ml-4 space-x-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {skeletonItems}
    </div>
  );
};

export default ListSkeleton;