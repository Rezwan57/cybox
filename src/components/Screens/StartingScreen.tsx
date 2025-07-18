import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const StartingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          🚀 App Loaded Successfully!
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background Flares */}
      <div className="absolute inset-0">
        {/* Flare 1 */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-30 animate-pulse blur-xl"></div>
        
        {/* Flare 2 */}
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full opacity-40 animate-pulse blur-xl" style={{animationDelay: '0.5s'}}></div>
        
        {/* Flare 3 */}
        <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full opacity-35 animate-pulse blur-xl" style={{animationDelay: '1s'}}></div>
        
        {/* Flare 4 */}
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-gradient-to-r from-green-600 to-teal-600 rounded-full opacity-25 animate-pulse blur-xl" style={{animationDelay: '1.5s'}}></div>
        
        {/* Moving particles */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-ping" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute top-2/3 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-ping" style={{animationDelay: '1.2s'}}></div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Vibrating and Scaling Logo */}
        <div className="relative mb-8">
          <Image
            src="/CYBOX.png"
            alt="Logo"
            width={200}
            height={200}
            className="animate-pulse vibrate scaleUp"
          />
        </div>

        {/* Loading Text */}
        <div className="text-gray-400 text-sm mt-4 animate-pulse">
          Loading your experience...
        </div>
      </div>

      <style jsx>{`
        @keyframes vibrate {
          0% { transform: translateX(0) translateY(0) scale(0.5); }
          10% { transform: translateX(-8px) translateY(0) scale(0.5); }
          20% { transform: translateX(8px) translateY(0) scale(0.5); }
          30% { transform: translateX(0) translateY(8px) scale(0.5); }
          40% { transform: translateX(-8px) translateY(0) scale(0.5); }
          50% { transform: translateX(0) translateY(-8px) scale(0.5); }
          60% { transform: translateX(8px) translateY(0) scale(0.5); }
          70% { transform: translateX(0) translateY(8px) scale(0.5); }
          71% { transform: translateX(0) translateY(0) scale(0.5); }
          100% { transform: translateX(0) translateY(0) scale(2); }
        }

        @keyframes scaleUp {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-loading-bar {
          animation: loadingBar 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .logo-container {
          animation: vibrate 7s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StartingScreen;