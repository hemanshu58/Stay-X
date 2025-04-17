import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaHeart } from "react-icons/fa";
import ConfirmationModal from "./static/ConfirmationModal";
import ListSkeleton from "../Skeletons/ListSkeleton"; // Import the skeleton component
import axios from "axios";
import { Helmet } from 'react-helmet-async';
import config from "../configs/config";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch the current user's details
  useEffect(() => {
    axios
      .get(`${config.baseUrl}/auth/currentuser`, { withCredentials: true })
      .then((response) => {
        const currentUser = response.data;
        setUserId(currentUser._id);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }, []);

  // Fetch properties for the current user directly
  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`${config.baseUrl}/users/properties/${userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setProperties(response.data); // Set properties directly from response
        })
        .catch((error) => {
          console.error("Error fetching properties:", error);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  }, [userId]);

  // Handle row click to navigate to the property page
  const handleRowClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Handle delete action
  const handleDelete = async () => {
    setIsModalOpen(false);
    setLoading(true);
    try {
      await axios.delete(`${config.baseUrl}/properties/${propertyToDelete}`, {
        withCredentials: true,
      });
      setProperties(
        properties.filter((property) => property._id !== propertyToDelete)
      );
    } catch (error) {
      console.error("Error deleting property or images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = (propertyId) => {
    navigate(`/edit/${propertyId}`);
  };

  return (
    <div className="container mx-auto mt-5 relative">
      <Helmet>
          <title>StayX | My Properties</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <h1 className="text-2xl font-bold m-4 text-center">My Properties</h1>
      <div className="grid grid-cols-1 gap-6">
        {loading || properties.length <= 0 ? (
          // Render the skeleton loader if loading is true
          <ListSkeleton /> // Skeleton loader component
        ) : (
          // Show properties if not loading and properties exist
          properties.map((property) => (
            <div
              key={property._id}
              className="flex items-center bg-white p-4 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleRowClick(property._id)}
            >
              {/* Property Image */}
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-60 h-32 rounded-lg mr-4"
              />
              {/* Property Details */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{property.title}</h2>
                <p className="text-gray-600 mt-1">
                  Rent: ₹{property.monthlyRent}
                </p>
              </div>
              {/* Category */}
              <div className="flex-1 text-gray-700 text-xl">
                {property.category.name}
              </div>
              {/* Like Count beside Heart Icon */}
              <div className="flex-1 flex items-center justify-center">
                <FaHeart
                  className={`text-2xl mr-2 ${
                    property.liked ? "text-red-500" : "text-gray-500"
                  }`}
                />
                <span className="text-xl">{property.likeCount}</span>
              </div>
              {/* Edit & Delete Icons */}
              <div className="flex items-center space-x-4 ml-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                  size={28}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(property._id);
                  }}
                />
                <FaTrashAlt
                  className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  size={28}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPropertyToDelete(property._id); // Set property ID to delete
                    setIsModalOpen(true); // Open modal
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MyProperties;
