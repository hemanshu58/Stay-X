import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaSearch, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import config from '../configs/config'; // Import the config to use the base URL

const Slider = () => {
  const [properties, setProperties] = useState([]);
  const [sliderProperties, setSliderProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all properties
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/properties/`, { // Use config.baseUrl
          withCredentials: true,
        });
        setProperties(response.data);
        setFilteredProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    // Fetch slider properties
    const fetchSliderProperties = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/slider/`, { // Use config.baseUrl
          withCredentials: true,
        });
        setSliderProperties(response.data);
      } catch (error) {
        console.error('Error fetching slider properties:', error);
      }
    };

    fetchProperties();
    fetchSliderProperties();
  }, []);

  // Function to handle adding a property to the slider
  const handleAddToSlider = async (propertyId) => {
    try {
      await axios.post(
        `${config.baseUrl}/slider/`, // Use config.baseUrl
        {
          property: propertyId,
        },
        {
          withCredentials: true,
        }
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error adding property to slider:', error);
    }
  };

  // Function to handle activating or deactivating a property on the slider
  const handleToggleActive = async (sliderId, currentStatus) => {
    try {
      await axios.put(
        `${config.baseUrl}/slider/${sliderId}`, // Use config.baseUrl
        {
          isActive: !currentStatus,
        },
        {
          withCredentials: true,
        }
      );
      const updatedSliderProperties = sliderProperties.map((sliderItem) =>
        sliderItem._id === sliderId ? { ...sliderItem, isActive: !currentStatus } : sliderItem
      );
      setSliderProperties(updatedSliderProperties);
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  // Function to delete a property from the slider
  const handleDeleteProperty = async (sliderId) => {
    try {
      await axios.delete(`${config.baseUrl}/slider/${sliderId}`, { // Use config.baseUrl
        withCredentials: true,
      });
      setSliderProperties(sliderProperties.filter((sliderItem) => sliderItem._id !== sliderId));
    } catch (error) {
      console.error('Error deleting property from slider:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const searchResults = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        property.category.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        property.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
        property.address.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProperties(searchResults);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Slider Properties</h1>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        <FaPlus className="inline-block mr-2" /> Add Property to Slider
      </button>

      <h2 className="text-xl font-bold my-4">Properties in Slider</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 text-left text-gray-600">Image</th>
              <th className="px-6 py-3 border-b-2 text-left text-gray-600">Title</th>
              <th className="px-6 py-3 border-b-2 text-left text-gray-600">City</th>
              <th className="px-6 py-3 border-b-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliderProperties.map((sliderItem) => (
              <tr key={sliderItem._id} className="border-b">
                <td className="px-6 py-4">
                  {sliderItem.property.images && sliderItem.property.images.length > 0 ? (
                    <img
                      src={sliderItem.property.images[0]}
                      alt={sliderItem.property.title}
                      className="w-40 h-20 rounded-md"
                    />
                  ) : (
                    <div className="w-40 h-20 bg-gray-200 flex items-center justify-center">No Image</div>
                  )}
                </td>
                <td className="px-6 py-4">{sliderItem.property.title}</td>
                <td className="px-6 py-4">{sliderItem.property.city}</td>
                <td className="px-6 py-10 flex space-x-4">
                  <button
                    onClick={() => handleToggleActive(sliderItem._id, sliderItem.isActive)}
                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                      sliderItem.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {sliderItem.isActive ? (
                      <>
                        <FaToggleOff className="mr-2" /> Deactivate
                      </>
                    ) : (
                      <>
                        <FaToggleOn className="mr-2" /> Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(sliderItem._id)}
                    className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <FaTrash className="ml-2 mr-2" /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Property</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800">
                Close
              </button>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search properties by title, category, address or city"
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <FaSearch className="ml-2 text-gray-500" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 text-left text-gray-600">Image</th>
                    <th className="px-6 py-3 border-b-2 text-left text-gray-600">Title</th>
                    <th className="px-6 py-3 border-b-2 text-left text-gray-600">Category</th>
                    <th className="px-6 py-3 border-b-2 text-left text-gray-600">City</th>
                    <th className="px-6 py-3 border-b-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property._id} className="border-b">
                      <td className="px-6 py-4">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-40 h-20 rounded-md"
                          />
                        ) : (
                          <div className="w-40 h-20 bg-gray-200 flex items-center justify-center">No Image</div>
                        )}
                      </td>
                      <td className="px-6 py-4">{property.title}</td>
                      <td className="px-6 py-4">{property.category.name}</td>
                      <td className="px-6 py-4">{property.city}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAddToSlider(property._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          <FaPlus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
