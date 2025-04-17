import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import config from "../configs/config";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { UserContext } from "../contexts/UserContext";

const MostLiked = () => {
  const [mostLikedProperties, setMostLikedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useContext(UserContext); // Now should be defined correctly
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMostLikedProperties = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/properties`);
        const sortedProperties = response.data
          .sort((a, b) => b.likeCount - a.likeCount)
          .slice(0, 6);
        setMostLikedProperties(sortedProperties);
      } catch (error) {
        console.error("Error fetching most liked properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostLikedProperties();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Liked Properties</h2>
      {loading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 mx-auto max-w-7xl">
          {mostLikedProperties.length > 0 ? (
            mostLikedProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{ ...property, image: property.images[0] }}
                loggedIn={loggedIn} // Pass loggedIn prop to PropertyCard
                onClick={() => navigate(`/property/${property._id}`)}
              />
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MostLiked;
