import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';

const ImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const { user, updateUserData, refreshUser } = useUser();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', file);

      console.log('Uploading image:', file.name);

      // Send to server
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/profile/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      console.log('Upload response:', response.data);

      // Handle success
      if (response.data.success && response.data.imageUrl) {
        console.log('Image URL received:', response.data.imageUrl);
        
        // Update context user data
        updateUserData({ profileImage: response.data.imageUrl });
        
        // Refresh user data from server
        await refreshUser();
        
        toast.success('Profile picture updated successfully');
      } else {
        toast.error('Upload succeeded but no image URL returned');
      }
    } catch (err) {
      console.error('Error uploading profile image:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar URL if no profile image
  const getAvatarUrl = () => {
    if (!user || !user.name) {
      return `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=80`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=80`;
  };

  return (
    <div className="relative group">
      {/* Current Image or Placeholder */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <Loader className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        <img
          src={user?.profileImage || getAvatarUrl()}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.onerror = null; // Prevent infinite fallback loop
            e.target.src = getAvatarUrl();
          }}
        />
        
        {/* Upload Camera Icon */}
        <label
          htmlFor="profile-image-upload"
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Camera className="w-8 h-8 text-white" />
        </label>
      </div>
      
      {/* Hidden File Input */}
      <input
        type="file"
        id="profile-image-upload"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleImageChange}
        disabled={loading}
      />
    </div>
  );
};

export default ImageUpload;