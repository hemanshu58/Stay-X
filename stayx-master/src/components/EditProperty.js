import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Replaced useHistory with useNavigate
import config from "../configs/config"; // Assuming you have config.js for baseUrl
import { Helmet } from 'react-helmet-async';

const EditProperty = () => {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate(); // Use navigate for redirecting after update

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
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFacilities, setSelectedCategoryFacilities] = useState([]);
  const [facilityValues, setFacilityValues] = useState({});

  // Fetch the property data by ID and populate fields
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/properties/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Equivalent to axios' withCredentials
        });

        const data = await response.json();
        if (response.ok) {
          setBasicDetails({
            title: data.title,
            description: data.description,
            price: data.monthlyRent,
            securityDeposit: data.securityDeposit,
            category: data.category,
          });
          setLocation({
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
          });
          setFacilityValues(
            data.facilities.reduce((acc, facility) => {
              acc[facility.facility] = facility.value;
              return acc;
            }, {})
          );
        } else {
          console.error("Error fetching property:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [id]);

  // Fetch categories from backend
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

  // Update facilities list when the category changes
  useEffect(() => {
    if (basicDetails.category) {
      const selectedCategory = categories.find(
        (cat) => cat._id === basicDetails.category
      );
      setSelectedCategoryFacilities(
        selectedCategory ? selectedCategory.facilities : []
      );
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

  const handleFacilityChange = (e, facilityId, type) => {
    const { value } = e.target;
    const updatedValue =
      type === "radio" ? (value === "true" ? true : false) : value;
    setFacilityValues({ ...facilityValues, [facilityId]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Update Button Clicked");

    // Prepare form data for submission
    const formData = {
      title: basicDetails.title,
      description: basicDetails.description,
      monthlyRent: basicDetails.price,
      securityDeposit: basicDetails.securityDeposit,
      category: basicDetails.category,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      facilities: Object.entries(facilityValues).map(([facilityId, value]) => ({
        facility: facilityId,
        value: value,
      })),
    };

    // Submit the form via PUT request
    try {
      const response = await fetch(`${config.baseUrl}/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Property updated:", data);
        navigate(`/myproperties`); 
      } else {
        console.error("Error updating property:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Helmet>
          <title>StayX | Edit Property</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-600">Edit Property</h2>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            Update Property
          </button>
        </div>

        {/* Navigation buttons to switch sections */}
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
        </div>

        {/* Render the current section */}
        <form onSubmit={handleSubmit}>
          {activeSection === "basicDetails" && (
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-bold">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={basicDetails.title}
                onChange={handleBasicDetailsChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label htmlFor="description" className="block mt-4 mb-2 font-bold">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={basicDetails.description}
                onChange={handleBasicDetailsChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>

              <label htmlFor="price" className="block mt-4 mb-2 font-bold">
                Price (₹ per month):
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={basicDetails.price}
                onChange={handleBasicDetailsChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label
                htmlFor="securityDeposit"
                className="block mt-4 mb-2 font-bold"
              >
                Security Deposit:
              </label>
              <input
                type="number"
                id="securityDeposit"
                name="securityDeposit"
                value={basicDetails.securityDeposit}
                onChange={handleBasicDetailsChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label htmlFor="category" className="block mt-4 mb-2 font-bold">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={basicDetails.category}
                onChange={handleBasicDetailsChange}
                className="w-full p-2 border border-gray-300 rounded"
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

          {activeSection === "facilities" && (
            <div className="mb-6">
              {selectedCategoryFacilities.map((facility) => (
                <div key={facility._id} className="mb-4">
                  <label htmlFor={facility._id} className="block mb-2 font-bold">
                    {facility.name}:
                  </label>
                  {facility.type === "checkbox" && (
                    <input
                      type="checkbox"
                      id={facility._id}
                      checked={facilityValues[facility._id] || false}
                      onChange={(e) =>
                        handleFacilityChange(e, facility._id, "checkbox")
                      }
                      className="w-4 h-4"
                    />
                  )}
                  {facility.type === "radio" && (
                    <div>
                      <label className="mr-2">
                        <input
                          type="radio"
                          name={facility._id}
                          value="true"
                          checked={facilityValues[facility._id] === true}
                          onChange={(e) =>
                            handleFacilityChange(e, facility._id, "radio")
                          }
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={facility._id}
                          value="false"
                          checked={facilityValues[facility._id] === false}
                          onChange={(e) =>
                            handleFacilityChange(e, facility._id, "radio")
                          }
                        />
                        No
                      </label>
                    </div>
                  )}
                  {facility.type === "number" && (
                    <input
                      type="number"
                      id={facility._id}
                      value={facilityValues[facility._id] || ""}
                      onChange={(e) =>
                        handleFacilityChange(e, facility._id, "number")
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === "location" && (
            <div className="mb-6">
              <label htmlFor="address" className="block mb-2 font-bold">
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={location.address}
                onChange={handleLocationChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label htmlFor="city" className="block mt-4 mb-2 font-bold">
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={location.city}
                onChange={handleLocationChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label htmlFor="state" className="block mt-4 mb-2 font-bold">
                State:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={location.state}
                onChange={handleLocationChange}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <label htmlFor="country" className="block mt-4 mb-2 font-bold">
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={location.country}
                onChange={handleLocationChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default EditProperty;
