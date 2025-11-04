// import React, { useState } from "react";
// import SimpleLoading from "./SImpleLoading";
// import BarLoading from "./BarLoading";
// import SkeletonLoading from "./SkeletonLoading";
// import LoadingComponent from "./LoadingComponent";

// const LoadingDemo = () => {
//   const [activeLoader, setActiveLoader] = useState<
//     "default" | "simple" | "bar" | "skeleton"
//   >("default");

//   const renderLoader = () => {
//     switch (activeLoader) {
//       case "simple":
//         return <SimpleLoading />;
//       case "bar":
//         return <BarLoading />;
//       case "skeleton":
//         return <SkeletonLoading />;
//       default:
//         return <LoadingComponent />;
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Loading Component Variants
//         </h1>

//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Choose a Loading Style:
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <button
//               onClick={() => setActiveLoader("default")}
//               className={`px-4 py-3 rounded-lg font-medium transition-colors ${
//                 activeLoader === "default"
//                   ? "bg-yellow-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Default
//             </button>
//             <button
//               onClick={() => setActiveLoader("simple")}
//               className={`px-4 py-3 rounded-lg font-medium transition-colors ${
//                 activeLoader === "simple"
//                   ? "bg-yellow-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Simple
//             </button>
//             <button
//               onClick={() => setActiveLoader("bar")}
//               className={`px-4 py-3 rounded-lg font-medium transition-colors ${
//                 activeLoader === "bar"
//                   ? "bg-yellow-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Bar
//             </button>
//             <button
//               onClick={() => setActiveLoader("skeleton")}
//               className={`px-4 py-3 rounded-lg font-medium transition-colors ${
//                 activeLoader === "skeleton"
//                   ? "bg-yellow-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Skeleton
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-8">
//           <h3 className="text-lg font-semibold mb-4">Preview:</h3>
//           <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <p className="text-gray-400 text-lg">Content area</p>
//             </div>
//             {renderLoader()}
//           </div>
//         </div>

//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <h4 className="font-semibold text-blue-900 mb-2">
//             Usage in Next.js:
//           </h4>
//           <pre className="bg-blue-900 text-blue-100 p-4 rounded text-sm overflow-x-auto">
//             {`import { LoadingComponent } from '@/components/Loading';

// // In your component or page
// {isLoading && <LoadingComponent />}`}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default LoadingDemo;
