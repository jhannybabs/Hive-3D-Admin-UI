import React from "react";

const SkeletonLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl w-96">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-yellow-200 rounded animate-pulse"></div>
              <div className="h-3 bg-yellow-100 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-yellow-200 rounded animate-pulse"></div>
            <div className="h-4 bg-yellow-100 rounded animate-pulse"></div>
            <div className="h-4 bg-yellow-200 rounded w-5/6 animate-pulse"></div>
          </div>
          <div className="pt-4 text-center">
            <p className="text-sm font-medium text-yellow-600 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
