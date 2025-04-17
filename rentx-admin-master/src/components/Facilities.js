import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { cloudinaryConfigResources } from "../configs/cloudinaryConfig";
import config from "../configs/config"; // Import configuration for base URL

const Facility = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [editedFacility, setEditedFacility] = useState({ name: "", type: "" });

  const [newFacility, setNewFacility] = useState({
    name: "",
    type: "number", // Default to "number"
    iconImage: "",
  });
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const baseUrl = config.baseUrl; // Use base URL from config

  const fetchFacilities = async () => {
    try {
      const response = await axios.get(`${baseUrl}/facilities/`, {
        withCredentials: true,
      });
      setFacilities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [baseUrl]);

  // Cloudinary image upload function
  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", cloudinaryConfigResources.uploadPreset);
    formData.append("cloud_name", cloudinaryConfigResources.cloudName);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfigResources.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (response.ok) return data.secure_url;
      else console.error("Failed to upload:", data.error.message);
      return null;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const handleDelete = async (facilityId) => {
    try {
      await axios.delete(`${baseUrl}/facilities/${facilityId}`, {
        withCredentials: true,
      });
      fetchFacilities(); // Re-fetch facilities after successful deletion
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
  };

  const handleEdit = (facility) => {
    setEditingFacilityId(facility._id);
    setEditedFacility({ name: facility.name, type: facility.type });
  };

  const handleSave = async (facilityId) => {
    try {
      await axios.put(`${baseUrl}/facilities/${facilityId}`, editedFacility, {
        withCredentials: true,
      });
      setEditingFacilityId(null);
      fetchFacilities(); // Re-fetch the updated facilities list after saving
    } catch (error) {
      console.error("Error updating facility:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingFacilityId(null);
  };

  const handleInputChange = (e) => {
    setEditedFacility({
      ...editedFacility,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewInputChange = (e) => {
    setNewFacility({
      ...newFacility,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFacility = async () => {
    try {
      if (imageFile) {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) {
          console.error("Failed to upload image");
          return;
        }
        newFacility.iconImage = imageUrl;
      }
      await axios.post(`${baseUrl}/facilities/`, newFacility, {
        withCredentials: true,
      });
      fetchFacilities(); // Re-fetch the updated facilities list after adding
      setNewFacility({ name: "", type: "number", iconImage: "" });
      setIsAddingFacility(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error adding facility:", error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Facilities</h1>

      {/* Add Facility Button */}
      <button
        onClick={() => setIsAddingFacility(!isAddingFacility)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600"
      >
        <FaPlus className="mr-2" /> Add Facility
      </button>

      {isAddingFacility && (
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <div className="space-y-4">
            {/* Facility Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Facility Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newFacility.name}
                onChange={handleNewInputChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the name of the facility"
              />
            </div>

            {/* Facility Type Input */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Facility Type
              </label>
              <select
                id="type"
                name="type"
                value={newFacility.type}
                onChange={handleNewInputChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="number">Number</option>
                <option value="radio">Radio</option>
              </select>
            </div>

            {/* Image Upload Input */}
            <div>
              <label htmlFor="iconImage" className="block text-sm font-medium text-gray-700 mb-2">
                Facility Icon Image
              </label>
              <input
                type="file"
                id="iconImage"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none"
                accept="image/*"
              />
              {imageFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover mt-2 border rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Save Facility Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddFacility}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Save Facility
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Display - Two per row */}
      <div className="grid grid-cols-2 gap-4">
        {facilities.map((facility) => (
          <div key={facility._id} className="p-4 border rounded-md bg-white shadow-md">
            <div className="flex items-center space-x-4">
              <img src={facility.iconImage} alt={facility.name} className="w-20 h-20 rounded-md" />
              <div>
                {editingFacilityId === facility._id ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editedFacility.name}
                      onChange={handleInputChange}
                      className="border px-2 py-1 mb-2 w-full"
                      placeholder="Name"
                    />
                    <select
                      name="type"
                      value={editedFacility.type}
                      onChange={handleInputChange}
                      className="border px-2 py-1 w-full"
                    >
                      <option value="number">Number</option>
                      <option value="radio">Radio</option>
                    </select>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-lg">{facility.name}</p>
                    <p className="text-gray-600">Type: {facility.type}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              {editingFacilityId === facility._id ? (
                <>
                  <button
                    onClick={() => handleSave(facility._id)}
                    className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(facility)}
                    className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(facility._id)}
                    className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 flex items-center"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facility;
