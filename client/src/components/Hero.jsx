// src/components/Hero.jsx
import React from 'react';

const Hero = () => (
  <div className="relative bg-white overflow-hidden">
    <div className="w-full">
      <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <main className="mt-10 w-full px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-blue-600">AlumConnect</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              Connect with your alma mater, build lasting relationships, and contribute to the future of education.
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
);

export default Hero;
