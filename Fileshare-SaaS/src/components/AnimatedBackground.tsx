
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }}></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2000ms', animationDuration: '3s' }}></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '3000ms', animationDuration: '4s' }}></div>
      
      {/* Moving gradient waves */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent animate-pulse"></div>
      <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      
      {/* Subtle geometric shapes */}
      <div className="absolute top-16 left-16">
        <div className="w-3 h-3 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1000ms', animationDuration: '2s' }}></div>
      </div>
      <div className="absolute top-32 right-32">
        <div className="w-2 h-2 bg-indigo-400/30 rounded-full animate-ping" style={{ animationDelay: '1500ms', animationDuration: '3s' }}></div>
      </div>
      <div className="absolute bottom-32 left-32">
        <div className="w-4 h-4 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '2500ms', animationDuration: '4s' }}></div>
      </div>
      
      {/* Rotating elements */}
      <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-blue-200/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 border border-indigo-200/20 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
    </div>
  );
};

export default AnimatedBackground;
