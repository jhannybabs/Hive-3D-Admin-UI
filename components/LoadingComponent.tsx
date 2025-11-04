import React from "react";
import { Loader2 } from "lucide-react";

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="relative">
        {/* Outer spinning ring with yellow accent */}
        <div className="absolute inset-0 rounded-full">
          <div className="w-32 h-32 border-4 border-yellow-200/30 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>

        {/* Middle spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 border-4 border-yellow-300/20 border-t-yellow-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          ></div>
        </div>

        {/* Inner content */}
        <div className="relative flex flex-col items-center justify-center w-32 h-32">
          <Loader2
            className="w-12 h-12 text-yellow-400 animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
          <p className="mt-4 text-sm font-medium text-yellow-400">Loading...</p>
        </div>
      </div>

      {/* Optional: Pulsing dots */}
      <div className="absolute bottom-1/3 flex space-x-2">
        <div
          className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingComponent;
