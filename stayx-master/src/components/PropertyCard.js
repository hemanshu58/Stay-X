import React, { useState, useEffect } from "react";
import config from "../configs/config";

const PropertyCard = ({ property, loggedIn, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(property.likeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      const checkIfLiked = async () => {
        try {
          const response = await fetch(`${config.baseUrl}/auth/currentuser`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const currentUser = await response.json();
          if (
            currentUser.favouriteProperties &&
            currentUser.favouriteProperties.some((fav) => fav === property._id)
          ) {
            setLiked(true);
          }
        } catch (error) {
          console.error("Error checking if property is liked:", error);
        }
      };
      checkIfLiked();
    }
  }, [loggedIn, property._id]);

  const handleLikeToggle = async () => {
    setIsLoading(true);
    try {
      const endpoint = liked
        ? `${config.baseUrl}/properties/${property._id}/dislike`
        : `${config.baseUrl}/properties/${property._id}/like`;

      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      setLikeCount(likeCount + (liked ? -1 : 1));
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking/disliking the property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={onClick}
      style={{ cursor: "pointer", maxWidth: "100%" }}
    >
      <div className="relative group">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-40 object-cover rounded-t-lg sm:h-48 transition-all duration-300 group-hover:brightness-75"
        />
        <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-500 via-green-500 to-teal-500 text-white text-lg px-5 py-2 rounded-br-lg font-semibold shadow-md transition-all duration-300 group-hover:translate-y-[-5px]">
          ₹{property.monthlyRent}/month
        </div>

        {loggedIn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeToggle();
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-transform transform ${
              liked ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
            } shadow-md hover:scale-125`}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin text-lg text-white" />
            ) : (
              <i className={`fas fa-heart text-lg ${liked ? "text-white" : "text-gray-500"}`} />
            )}
          </button>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg">
        <h3 className="text-xl font-bold text-teal-700 mb-1">{property.title}</h3>
        <p className="text-gray-500 mb-3 flex items-center">
          <i className="fas fa-map-marker-alt text-teal-500 mr-2"></i>
          {property.city}, {property.state}
        </p>
        <hr className="my-3" />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex space-x-4">
              {property.facilities.slice(0, 2).map((facility, index) => (
                <p className="flex items-center text-lg font-semibold mr-5" key={index}>
                  <i
                    className={`fas ${
                      index === 0 ? "fa-bath" : "fa-bed"
                    } text-teal-500 mr-3 text-2xl`}
                  />
                  {facility.value}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-red-500"></i>
            <span className="text-gray-700 font-medium">{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
