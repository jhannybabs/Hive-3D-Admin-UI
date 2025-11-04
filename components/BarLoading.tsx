import React from "react";
import { Loader2 } from "lucide-react";

const BarLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl w-80">
        <div className="flex flex-col items-center space-y-6">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full animate-pulse"
                style={{
                  width: "100%",
                  animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              ></div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700">
            Loading your data...
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarLoading;
