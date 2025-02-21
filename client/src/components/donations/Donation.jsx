// src/components/donations/Donation.jsx
import React, { useState } from 'react';

const Donation = () => {
  const [donationData, setDonationData] = useState({
    amount: '',
    name: '',
    email: '',
    graduationYear: '',
    pan: '',
    purpose: 'general'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
      
      if (response.ok) {
        // Handle successful donation initiation
        const paymentData = await response.json();
        // Handle payment flow
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Make a Donation</h2>
        <p className="text-gray-600 mb-6">Support your alma mater and receive tax benefits under 80G</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              value={donationData.amount}
              onChange={(e) => setDonationData({...donationData, amount: e.target.value})}
              required
              min="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              value={donationData.name}
              onChange={(e) => setDonationData({...donationData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={donationData.email}
              onChange={(e) => setDonationData({...donationData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Year of graduation"
              value={donationData.graduationYear}
              onChange={(e) => setDonationData({...donationData, graduationYear: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PAN Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PAN for tax exemption"
              value={donationData.pan}
              onChange={(e) => setDonationData({...donationData, pan: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Donation
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={donationData.purpose}
              onChange={(e) => setDonationData({...donationData, purpose: e.target.value})}
            >
              <option value="general">General Fund</option>
              <option value="scholarship">Scholarship Fund</option>
              <option value="infrastructure">Infrastructure Development</option>
              <option value="research">Research Programs</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
