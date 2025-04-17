import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import CardSkeleton from "../Skeletons/CardSkeleton"; // Import Skeleton instead of Spinner
import config from "../configs/config";
import { Helmet } from 'react-helmet-async';
import { UserContext } from "../contexts/UserContext";

const FavouriteProperties = () => {
  const [favouriteProperties, setFavouriteProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const { loggedIn } = useContext(UserContext); 

  useEffect(() => {
    const fetchFavouriteProperties = async () => {
      try {
        // Fetch current user to get their favorite properties
        const userResponse = await axios.get(
          `${config.baseUrl}/auth/currentuser`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials for cookie-based sessions
          }
        );

        const { favouriteProperties: favPropertyIds } = userResponse.data;

        if (favPropertyIds && favPropertyIds.length > 0) {
          // Fetch the actual favorite property details
          const propertyPromises = favPropertyIds.map((id) =>
            axios.get(`${config.baseUrl}/properties/${id}`)
          );
          const propertyResponses = await Promise.all(propertyPromises);

          // Get the property data from the responses
          const fetchedProperties = propertyResponses.map(
            (response) => response.data
          );
          setFavouriteProperties(fetchedProperties);
        }
      } catch (error) {
        console.error("Error fetching favourite properties:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after data is fetched
      }
    };

    fetchFavouriteProperties();
  }, []);

  const handleViewProperty = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="p-4">
      <Helmet>
        <title>StayX | Favourite Properties</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Favourite Properties</h2>
      {loading ? (
        <CardSkeleton count={6} /> 
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 mx-auto max-w-7xl">
          {favouriteProperties.length > 0 ? (
            favouriteProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  ...property,
                  image: property.images[0],
                }}
                loggedIn={loggedIn}
                onClick={() => handleViewProperty(property._id)}
              />
            ))
          ) : (
            <p>No favourite properties found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FavouriteProperties;
