import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { cloudinaryConfigResources } from "../configs/cloudinaryConfig";
import config from "../configs/config"; // Import config for baseUrl

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    facilities: [],
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    iconImage: "",
    facilities: [],
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch all categories and facilities
  const fetchCategories = async () => {
    try {
      const [categoryResponse, facilityResponse] = await Promise.all([
        axios.get(`${config.baseUrl}/categories/`, {
          withCredentials: true,
        }),
        axios.get(`${config.baseUrl}/facilities/`, {
          withCredentials: true,
        }),
      ]);
      setCategories(categoryResponse.data);
      setFacilities(facilityResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Handle facility selection
  const handleFacilityChange = (facilityId) => {
    setSelectedFacilities((prevSelected) =>
      prevSelected.includes(facilityId)
        ? prevSelected.filter((id) => id !== facilityId)
        : [...prevSelected, facilityId]
    );
  };

  // Add Category
  const handleAddCategory = async () => {
    try {
      if (imageFile) {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) {
          console.error("Failed to upload image");
          return;
        }
        newCategory.iconImage = imageUrl;
      }
      newCategory.facilities = selectedFacilities; // Set selected facilities
      await axios.post(
        `${config.baseUrl}/categories/`,
        newCategory,
        { withCredentials: true }
      );
      fetchCategories(); // Re-fetch the updated categories list
      setNewCategory({ name: "", iconImage: "", facilities: [] });
      setSelectedFacilities([]);
      setIsAddingCategory(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(
        `${config.baseUrl}/categories/${categoryId}`,
        { withCredentials: true }
      );
      fetchCategories(); // Re-fetch categories after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditedCategory({ name: category.name, facilities: category.facilities });
    setSelectedFacilities(category.facilities); // Set selected facilities for editing
  };

  const handleSave = async () => {
    try {
      editedCategory.facilities = selectedFacilities; // Update facilities for edited category
      await axios.put(
        `${config.baseUrl}/categories/${editingCategoryId}`,
        editedCategory,
        { withCredentials: true }
      );
      setEditingCategoryId(null);
      fetchCategories(); // Re-fetch the updated categories list after saving
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };

  const handleInputChange = (e) => {
    setEditedCategory({
      ...editedCategory,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Add Category Button */}
      <button
        onClick={() => setIsAddingCategory(!isAddingCategory)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600"
      >
        <FaPlus className="mr-2" /> Add Category
      </button>

      {isAddingCategory && (
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <div className="space-y-4">
            {/* Category Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the name of the category"
              />
            </div>

            {/* Image Upload Input */}
            <div>
              <label
                htmlFor="iconImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Icon Image
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

            {/* Facility Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Facilities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {facilities.map((facility) => (
                  <div key={facility._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={facility._id}
                      checked={selectedFacilities.includes(facility._id)}
                      onChange={() => handleFacilityChange(facility._id)}
                      className="mr-2"
                    />
                    <label htmlFor={facility._id} className="text-sm">
                      {facility.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Category Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddCategory}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Display */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="p-4 border rounded-md bg-white shadow-md"
          >
            <div className="flex items-center space-x-4">
              {editingCategoryId === category._id ? (
                // Show input for editing category name
                <input
                  type="text"
                  name="name"
                  value={editedCategory.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              ) : (
                <img
                  src={category.iconImage}
                  alt={category.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
              <div>
                {editingCategoryId === category._id ? (
                  // Show the name of the category only if not in editing mode
                  <h2 className="text-lg font-semibold">
                    {editedCategory.name}
                  </h2>
                ) : (
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                )}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              {editingCategoryId === category._id ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <FaTrash />
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

export default Category;
