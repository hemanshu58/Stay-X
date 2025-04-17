// src/components/Profile.js
import React, { useState, useEffect, useRef } from "react";
import config from "../configs/config"; // Ensure you have a config file for base URL
import { cloudinaryConfigProfile } from "../configs/cloudinaryConfig"; // Cloudinary configuration
import { Helmet } from 'react-helmet-async';

const Spinner = ({ small }) => {
  return (
    <div className={`flex items-center justify-center ${small ? 'w-5 h-5' : 'w-8 h-8'} border-4 border-t-transparent border-teal-600 rounded-full animate-spin`}></div>
  );
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null); // Reference for the file input

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/auth/currentuser`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // To ensure cookies are included
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setEditedUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", cloudinaryConfigProfile.uploadPreset);
    formData.append("cloud_name", cloudinaryConfigProfile.cloudName);

    try {
      setUploading(true);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfigProfile.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return data.secure_url; // Return the uploaded image URL
      } else {
        throw new Error(data.error.message || "Failed to upload");
      }
    } catch (err) {
      setError("Failed to upload the image.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!editedUser.name) errors.name = "Name is required.";
    if (!editedUser.mobileNumber) {
      errors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(editedUser.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return; // Validate form before submission

    try {
      let imageUrl = editedUser.avatar; // Keep the current avatar if no new image is uploaded

      // If a new image is selected, upload it
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) throw new Error("Image upload failed");
      }

      editedUser.avatar = imageUrl; // Update the avatar URL in the edited user object
      const response = await fetch(`${config.baseUrl}/users/${editedUser._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // To ensure cookies are included
        body: JSON.stringify({ ...editedUser }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const data = await response.json();
      setEditedUser(data); // Update the local state with the edited user data
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleProfileClick = () => {
    // Trigger the file input click when profile picture is clicked
    fileInputRef.current.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Show loading spinner */}
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto mt-10 relative">
      <Helmet>
          <title>StayX | Profile</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <div className="flex items-center justify-center mb-4">
        <img
          src={previewUrl || editedUser.avatar}
          alt="User Avatar"
          className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-md cursor-pointer"
          onClick={handleProfileClick} // Trigger file input when image is clicked
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden" // Hide the file input
          ref={fileInputRef} // Reference to the file input
        />
      </div>
      <div className="text-center mb-6">
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              className={`text-xl font-semibold mb-2 border-b-2 border-gray-300 text-center ${formErrors.name ? "border-red-500" : ""}`}
              placeholder="Name"
            />
            {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
            <p className="text-gray-600 mb-1">Email: {editedUser.email}</p>
            <input
              type="text"
              name="mobileNumber"
              value={editedUser.mobileNumber}
              onChange={handleChange}
              className={`text-gray-600 mb-1 border-b-2 border-gray-300 text-center ${formErrors.mobileNumber ? "border-red-500" : ""}`}
              placeholder="Mobile Number"
            />
            {formErrors.mobileNumber && <p className="text-red-500">{formErrors.mobileNumber}</p>}
            <div className="flex justify-around mt-4">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-teal-600 text-white rounded-md relative"
              >
                {uploading ? (
                  <div className="flex items-center">
                    <Spinner small /> {/* Small spinner while uploading */}
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">{editedUser.name}</h1>
            <p className="text-gray-600 mb-1">Email: {editedUser.email}</p>
            <p className="text-gray-600 mb-1">Mobile: {editedUser.mobileNumber}</p>
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
