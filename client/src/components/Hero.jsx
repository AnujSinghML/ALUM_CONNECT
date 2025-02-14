import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const institutes = [
  { id: 1, name: "IIIT Nagpur", logo: "src/img/IIITN_logo.svg", location: "Nagpur" },
  { id: 2, name: "IIT Bombay", logo: "src/img/IITB_logo.svg", location: "Bombay" },
  { id: 3, name: "IIT Kanpur", logo: "src/img/IITK_logo.svg", location: "Kanpur" },
  { id: 4, name: "IIT Kharagpur", logo: "src/img/IIT_Kharagpur_Logo.svg", location: "Kharagpur" },
  { id: 5, name: "IIT Delhi", logo: "src/img/IITD_logo.svg", location: "Delhi" },
  { id: 6, name: "IIT Roorkee", logo: "src/img/Indian_Institute_of_Technology_Roorkee_Logo.svg", location: "Roorkee" }
];

const Hero = () => {
  return (
    
     <div className="relative bg-white pt-10"> {/* Ensured no extra gap */}
      <main className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <section className="flex flex-col items-center text-center py-20">
      {/* Logo Positioned Above */}
      <img src="src/img/connect_logo_black .png" alt="Alum Connect Logo" className="w-40 mb-6" />

      {/* Heading */}
      <h1 className="text-5xl font-bold text-gray-900">
        Welcome to <span className="text-blue-600">AlumConnect</span>
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 mt-4 max-w-lg">
        Connect with your alma mater, build lasting relationships, and contribute to the future of education.
      </p>
    </section>

        {/* Institutes Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-2xl font-bold">Institutes Already With Us</h2>
            <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full">
              {institutes.length} Top Universities
            </span>
          </div>
          
          {/* Slider Section */}
          <div className="relative px-12">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
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
              className="institute-swiper"
            >
              {institutes.map((institute) => (
                <SwiperSlide key={institute.id}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mx-2">
                    <div className="h-16 flex items-center justify-center mb-4">
                      <img
                        src={institute.logo}
                        alt={`${institute.name} logo`}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-gray-900">{institute.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{institute.location}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="swiper-button-prev !absolute !left-0 top-1/2 -translate-y-1/2 z-10">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next !absolute !right-0 top-1/2 -translate-y-1/2 z-10">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;

