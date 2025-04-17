import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import config from "../configs/config";
import { cloudinaryConfigProperty } from "../configs/cloudinaryConfig";
import { Helmet } from 'react-helmet-async';

const UploadProperty = () => {
  const [activeSection, setActiveSection] = useState("basicDetails");
  const [basicDetails, setBasicDetails] = useState({
    title: "",
    description: "",
    price: "",
    securityDeposit: "",
    category: "",
  });
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "Gujarat",
    country: "India",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFacilities, setSelectedCategoryFacilities] = useState(
    []
  );
  const [facilityValues, setFacilityValues] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", cloudinaryConfigProperty.uploadPreset);
    formData.append("cloud_name", cloudinaryConfigProperty.cloudName);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfigProperty.cloudName}/image/upload`,
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (basicDetails.category) {
      const selectedCategory = categories.find(
        (cat) => cat._id === basicDetails.category
      );
      setSelectedCategoryFacilities(
        selectedCategory ? selectedCategory.facilities : []
      );
      setFacilityValues({});
    } else {
      setSelectedCategoryFacilities([]);
    }
  }, [basicDetails.category, categories]);

  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ ...basicDetails, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleFacilityChange = (e, facilityId, type) => {
    const { value } = e.target;
    const updatedValue =
      type === "radio" ? (value === "true" ? true : false) : value;
    setFacilityValues({ ...facilityValues, [facilityId]: updatedValue });
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Validation before submission
  const validateForm = () => {
    const { title, description, price, category } = basicDetails;
    const { address, city, state, country } = location;

    // Validate basic details
    const isBasicDetailsValid =
      title.trim() !== "" &&
      description.trim() !== "" &&
      price.trim() !== "" &&
      category.trim() !== "";

    // Validate location
    const isLocationValid =
      address.trim() !== "" &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      country.trim() !== "";

    // Validate facilities (ensure all facilities have values)
    const isFacilitiesValid = selectedCategoryFacilities.every((facility) => {
      const value = facilityValues[facility._id];
      // Check for existence and ensure it's not empty
      return value !== undefined && value !== "";
    });

    // Validate images (at least one image should be uploaded)
    const isImagesValid = images.length > 0;

    return (
      isBasicDetailsValid &&
      isLocationValid &&
      isFacilitiesValid &&
      isImagesValid
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Show loading spinner

    const imageUploadPromises = images.map((image) =>
      uploadImageToCloudinary(image)
    );
    const uploadedImageUrls = await Promise.all(imageUploadPromises);
    const successfulUploads = uploadedImageUrls.filter((url) => url !== null);

    const formData = {
      title: basicDetails.title,
      description: basicDetails.description,
      monthlyRent: basicDetails.price,
      securityDeposit: basicDetails.securityDeposit, // Security deposit can be optional
      category: basicDetails.category,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      images: successfulUploads,
      facilities: Object.entries(facilityValues).map(([facilityId, value]) => ({
        facility: facilityId,
        value: value,
      })),
    };

    try {
      const response = await fetch(`${config.baseUrl}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setBasicDetails({
          title: "",
          description: "",
          price: "",
          securityDeposit: "",
          category: "",
        });
        setLocation({
          address: "",
          city: "",
          state: "Gujarat",
          country: "India",
        });
        setImages([]);
        setFacilityValues({});
        setTimeout(() => {
          setShowSuccessMessage(false);
          setLoading(false); // Hide loading spinner
          navigate("/myproperties");
        }, 3000);
      } else {
        console.error("Error uploading property:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading property:", error);
    } finally {
      setLoading(false); // Hide loading spinner in case of failure
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Helmet>
          <title>StayX | Upload Property</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <div className={`bg-white p-8 rounded-lg shadow-lg relative $`}>
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 z-50">
            <Spinner />
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-600">Upload Property</h2>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
          >
            Upload Property
          </button>
        </div>

        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              {" "}
              Property uploaded successfully.
            </span>
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeSection === "basicDetails"
                ? "bg-teal-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveSection("basicDetails")}
          >
            Basic Details
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeSection === "facilities"
                ? "bg-teal-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveSection("facilities")}
          >
            Facilities
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeSection === "location"
                ? "bg-teal-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveSection("location")}
          >
            Location
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeSection === "images"
                ? "bg-teal-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveSection("images")}
          >
            Images
          </button>
        </div>

        <form>
          {activeSection === "basicDetails" && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Basic Details</h3>
              <input
                type="text"
                name="title"
                value={basicDetails.title}
                onChange={handleBasicDetailsChange}
                placeholder="Title"
                className="block w-full border rounded p-2 mb-4"
              />
              <textarea
                name="description"
                value={basicDetails.description}
                onChange={handleBasicDetailsChange}
                placeholder="Description"
                className="block w-full border rounded p-2 mb-4"
              />
              <input
                type="number"
                name="price"
                value={basicDetails.price}
                onChange={handleBasicDetailsChange}
                placeholder="Price"
                className="block w-full border rounded p-2 mb-4"
              />
              <input
                type="number"
                name="securityDeposit"
                value={basicDetails.securityDeposit}
                onChange={handleBasicDetailsChange}
                placeholder="Security Deposit"
                className="block w-full border rounded p-2 mb-4"
              />
              <select
                name="category"
                value={basicDetails.category}
                onChange={handleBasicDetailsChange}
                className="block w-full border rounded p-2 mb-4"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeSection === "facilities" &&
            selectedCategoryFacilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategoryFacilities.map((facility) => (
                    <div key={facility._id} className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        {facility.name}
                      </label>
                      {facility.type === "number" ? (
                        <input
                          type="number"
                          value={facilityValues[facility._id] || ""}
                          onChange={(e) =>
                            handleFacilityChange(e, facility._id, "number")
                          }
                          className="block w-1/2 border rounded p-2 text-center"
                          placeholder="Enter value"
                        />
                      ) : (
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="true"
                              checked={facilityValues[facility._id] === true}
                              onChange={(e) =>
                                handleFacilityChange(e, facility._id, "radio")
                              }
                              className="hidden"
                            />
                            <span
                              className={`px-4 py-2 rounded-md ${
                                facilityValues[facility._id] === true
                                  ? "bg-teal-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              Yes
                            </span>
                          </label>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value="false"
                              checked={facilityValues[facility._id] === false}
                              onChange={(e) =>
                                handleFacilityChange(e, facility._id, "radio")
                              }
                              className="hidden"
                            />
                            <span
                              className={`px-4 py-2 rounded-md ${
                                facilityValues[facility._id] === false
                                  ? "bg-teal-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              No
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {activeSection === "location" && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <input
                type="text"
                name="address"
                value={location.address}
                onChange={handleLocationChange}
                placeholder="Address"
                className="block w-full border rounded p-2 mb-4"
              />
              <input
                type="text"
                name="city"
                value={location.city}
                onChange={handleLocationChange}
                placeholder="City"
                className="block w-full border rounded p-2 mb-4"
              />
              <input
                type="text"
                name="state"
                value={location.state}
                onChange={handleLocationChange}
                placeholder="State"
                className="block w-full border rounded p-2 mb-4"
              />
              <input
                type="text"
                name="country"
                value={location.country}
                onChange={handleLocationChange}
                placeholder="Country"
                className="block w-full border rounded p-2 mb-4"
              />
            </div>
          )}

          {activeSection === "images" && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Images</h3>
              <input
                type="file"
                multiple
                onChange={handleImagesChange}
                className="block w-full border rounded p-2 mb-4"
              />
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadProperty;
