import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const institutes = [
  { id: 1, name: "IIIT Nagpur", logo: "src/assets/IIITN_logo.svg", location: "Nagpur" },
  { id: 2, name: "IIT Bombay", logo: "src/assets/IITB_logo.svg", location: "Bombay" },
  { id: 3, name: "IIT Kanpur", logo: "src/assets/IITK_logo.svg", location: "Kanpur" },
  { id: 4, name: "IIT Kharagpur", logo: "src/assets/IITKh_logo.svg", location: "Kharagpur" },
  { id: 5, name: "IIT Delhi", logo: "src/assets/IITD_logo.svg", location: "Delhi" },
  { id: 6, name: "IIT Roorkee", logo: "src/assets/IITR_logo.svg", location: "Roorkee" },
];

const Hero = () => {
  return (
    <div className="relative bg-white pt-16">
      <main className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <section className="flex flex-col items-center text-center py-20">
          <img src="src/assets/connect_logo_black.png" alt="Alum Connect Logo" className="w-40 mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600 block mt-2">AlumConnect</span>
          </h1>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with your alma mater, build lasting relationships and contribute to the future of education.
          </p>
        </section>

        {/* Institutes Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 px-4">
            <h2 className="text-3xl font-bold text-gray-900">Institutes Already With Us</h2>
            <span className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-full">
              {institutes.length} Top Universities
            </span>
          </div>

          {/* Swiper Container with Fixed Width */}
          <div className="relative mx-auto px-12">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white to-transparent z-10"></div>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="!px-4"
            >
              {institutes.map((institute) => (
                <SwiperSlide key={institute.id}>
                  <div className="bg-white rounded-xl shadow-xl hover:shadow-md transition-all duration-300 p-8 border border-gray-100 mb-15">
                    <div className="h-20  flex items-center justify-center mb-6">
                      <img 
                        src={institute.logo} 
                        alt={`${institute.name} logo`} 
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{institute.name}</h3>
                      <p className="text-sm text-gray-500 mt-2">{institute.location}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows */}
            <button className="swiper-button-prev !absolute !left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next !absolute !right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;



