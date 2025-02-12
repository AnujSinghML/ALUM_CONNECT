// import React from 'react';
// import { ArrowUpRight, MessageCircle, Gift, Search, Users, Bell } from 'lucide-react';

// // Navbar Component
// const Navbar = () => (
//   <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
//     <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//       {/* Logo */}
//       <div className="logo flex items-center">
//         <a href="index.html" className="flex items-center">
//           <img src="src/img/white_logo-Photoroom.jpg" width="80" height="60" alt="Logo" />
//           <h1 className="ml-2 text-2xl font-bold text-gray-800">Alum Connect</h1>
//         </a>
//       </div>
//       {/* Navigation Links and Button */}
//       <div className="nav-right flex items-center space-x-8">
//         <ul className="flex items-center space-x-8">
//           <li>
//             <a href="#" className="text-gray-700 hover:text-gray-900">
//               Home
//             </a>
//           </li>
//           {/* About Link with Hover Dropdown */}
//           <li className="relative">
//             <a
//               href="#about"
//               className="text-gray-700 hover:text-gray-900 inline-block group"
//             >
//               About
//               <div className="hover-box absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     About DevNexus
//                   </h2>
//                 </div>
//                 <p className="mt-4 text-sm text-gray-600">
//                   We are DevNexus, a passionate team of dedicated developers,
//                   focused on bridging the gap between alumni and their alma mater.
//                   As a dynamic and innovative startup, we aim to create meaningful
//                   connections that strengthen the bond between alumni, current
//                   students, and the institution.
//                 </p>
//                 <p className="mt-4 text-sm text-gray-600">
//                   Our team brings together diverse skills in web development,
//                   machine learning, app development, and design to ensure the
//                   platform is robust, scalable, and user-friendly. With a shared
//                   vision, we strive to provide a seamless experience for all users.
//                 </p>
//                 <div className="mt-4">
//                   <h3 className="text-center text-sm font-semibold text-gray-800">
//                     Mission
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-600">
//                   Our mission is to empower alumni to stay connected with their college and juniors, fostering a collaborative network where knowledge, experiences, and opportunities can be shared freely. We believe in building strong relationships that benefit both individuals and the institution.
//                   </p>
//                   <h3 className="mt-4 text-center text-sm font-semibold text-gray-800">
//                     Vision
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-600">
//                   We envision a thriving alumni network where every alumnus plays a vital role in the growth and development of the college community. By enabling seamless communication and interaction, we aim to create an ecosystem where alumni and students can collaborate to uplift their institution and make it a center of excellence.
//                   </p>
//                   <h3 className="mt-4 text-center text-sm font-semibold text-gray-800">
//                     Goal
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-600">
//                   Our goal is to provide a platform where alumni can actively contribute to their college’s progress. Through mentoring, donations, and networking, alumni can help shape the future of the college, offering invaluable support to students and faculty alike.
//                   </p>
//                 </div>
//               </div>
//             </a>
//           </li>
//           {/* Contact Link with Hover Dropdown */}
//           <li className="relative">
//             <a
//               href="#contact"
//               className="text-gray-700 hover:text-gray-900 inline-block group"
//             >
//               Contact
//               <div className="hover-box absolute right-1/2 transform translate-x-1/2 top-full mt-2 w-96 p-6 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     Get in Touch with Us
//                   </h2>
//                 </div>
//                 <p className="mt-4 text-sm text-gray-600">
//                   At DevNexus, we are committed to creating lasting relationships
//                   that connect alumni with their alma mater and current students.
//                   Whether you are an alumnus looking to give back or a student
//                   seeking guidance, we are here to support you.
//                 </p>
//                 <p className="mt-4 text-sm text-gray-600">
//                   Anuj Singh
//                   <br />
//                   <a
//                     href="https://www.linkedin.com/in/anujsanjaysingh/"
//                     className="text-blue-600 hover:underline"
//                   >
//                     LinkedIn
//                   </a>
//                   <br />
//                   <a
//                     href="https://www.instagram.com/glockholm/"
//                     className="text-pink-600 hover:underline"
//                   >
//                     Instagram
//                   </a>
//                   <br />
//                   Contact: +91 9987337572
//                 </p>
//                 <p className="mt-4 text-sm text-gray-600">
//                   For general inquiries, or to learn more about contributing to the
//                   alumni community, please contact us at:
//                   <br />
//                   Email: contact@devnexus.com
//                   <br />
//                   Phone: +91 -
//                   <br />
//                   Stay updated with our latest news:
//                   <br />
//                   <a
//                     href="#"
//                     className="text-blue-600 hover:underline"
//                   >
//                     LinkedIn (DevNexus)
//                   </a>
//                   <br />
//                   <a
//                     href="#"
//                     className="text-pink-600 hover:underline"
//                   >
//                     Instagram (DevNexus)
//                   </a>
//                 </p>
//                 <p className="mt-4 text-sm text-gray-600 text-center">
//                   At DevNexus, we believe in the power of community and look
//                   forward to connecting with you.
//                 </p>
//               </div>
//             </a>
//           </li>
//         </ul>
//         {/* Only Sign Up Now button (Download Our App removed) */}
//         <div className="button-container">
//           <a
//             href="login.html"
//             className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
//           >
//             Sign Up Now
//           </a>
//         </div>
//       </div>
//     </div>
//   </nav>
// );

// // Main App Component
// const App = () => {
//   const services = [
//     {
//       title: "Announcements",
//       description:
//         "Stay updated with live announcements on reunions, alumni success stories, upcoming workshops, guest lectures, and college events. Get notified about how alumni can participate in these occasions, fostering a strong, connected community.",
//       icon: <Bell className="w-6 h-6" />,
//     },
//     {
//       title: "Networking Hub",
//       description:
//         "Our platform enables alumni to connect with fellow graduates, share professional achievements, job promotions, and opportunities. Whether you're looking for referrals, relocating to a new city, or seeking like-minded individuals to launch a startup, our hub has you covered.",
//       icon: <Users className="w-6 h-6" />,
//     },
//     {
//       title: "Guidance and Mentorship",
//       description:
//         "Students can access personalized guidance from alumni through secure, encrypted messages. Whether it's career advice or general mentorship, alumni can help students in a safe and supportive environment, promoting mental wellness.",
//       icon: <MessageCircle className="w-6 h-6" />,
//     },
//     {
//       title: "Smart Searches",
//       description:
//         "Users can update their profiles with professional details, making it easier for others to find them using smart AI-based search filters. Search by company, job title, field of expertise, or location, and connect with peers or mentors.",
//       icon: <Search className="w-6 h-6" />,
//     },
//     {
//       title: "Community Building",
//       description:
//         "Join or create discussion communities based on professional fields, companies, or interests. Alumni can address common questions from students, offer resume reviews, and engage in productive  discussions on an interactive board. Our resume review community is led by elected alumni.",
//       icon: <Users className="w-6 h-6" />,
//     },
//     {
//       title: "Donations",
//       description:
//         "Support your alma mater through our secure, government-backed donation portal with tax exemptions.You can also raise funds for startups or find investors, empowering future innovators.",
//       icon: <Gift className="w-6 h-6" />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20">
//       <Navbar />
//       {/* Hero Section */}
//       <div className="relative bg-white overflow-hidden">
//         <div className="w-full">
//           <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
//             <main className="mt-10 w-full px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
//               <div className="text-center">
//                 <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//                   <span className="block">Welcome to</span>
//                   <span className="block text-blue-600">AlumConnect</span>
//                 </h1>
//                 <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
//                   Connect with your alma mater, build lasting relationships, and
//                   contribute to the future of education.
//                 </p>
//               </div>
//             </main> 
//           </div>
//         </div>
//       </div>
//       {/* Services Section */}
//       <div className="py-12 bg-white">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//               Our Services
//             </h2>
//           </div>
//           <div className="mt-10">
//             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//               {services.map((service, index) => (
//                 <div
//                   key={index}
//                   className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
//                       {service.icon}
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900">
//                       {service.title}
//                     </h3>
//                   </div>
//                   <p className="mt-4 text-gray-500">{service.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       <footer className="bg-gray-800">
//         <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div>
//               <h3 className="text-white text-lg font-semibold mb-4">
//                 Contact Us
//               </h3>
//               <p className="text-gray-300">Email: alumconnect@gmail.com</p>
//               <p className="text-gray-300">Phone: (123) 456-7890</p>
//             </div>
//             <div>
//               <h3 className="text-white text-lg font-semibold mb-4">
//                 Quick Links
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-gray-300 hover:text-white">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-300 hover:text-white">
//                     Terms of Service
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-gray-300 hover:text-white">
//                     Support
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-white text-lg font-semibold mb-4">
//                 Follow Us
//               </h3>
//               <div className="flex space-x-4">
//                 <a href="#" className="text-gray-300 hover:text-white">
//                   Facebook
//                 </a>
//                 <a href="#" className="text-gray-300 hover:text-white">
//                   Twitter
//                 </a>
//                 <a href="#" className="text-gray-300 hover:text-white">
//                   LinkedIn
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="mt-8 border-t border-gray-700 pt-8">
//             <p className="text-center text-gray-400">
//               &copy; 2024 AlumConnect. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default App;
// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <Hero />
      <Services />
      <Footer />
    </div>
  );
};

export default App;
