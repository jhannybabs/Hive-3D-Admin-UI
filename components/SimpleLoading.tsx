import React from "react";

const SimpleLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Loading</h3>
            <p className="text-sm text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
<p></p>
export default SimpleLoading;
