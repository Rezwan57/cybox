import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const StartingScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); // Wait for fade out
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Adjust speed of loading

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center transition-opacity duration-500"
         style={{ opacity: progress >= 100 ? 0 : 1 }}>
      
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/CYBOX.png"
          alt="Logo"
          width={500}
          height={500}
          className="at-item"
        />
      </div>
    </div>
  );
};

export default StartingScreen;