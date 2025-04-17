import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../configs/config";
import SliderSkeleton from "../Skeletons/SliderSkeleton"; // Skeleton Loader

const PropertySlider = () => {
  const navigate = useNavigate();
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slider data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/slider/`);
        const filteredData = response.data.filter((property) => property.isActive);
        setSliderData(filteredData);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false, // Removed manual arrows for a clean look
  };

  const handleViewProperty = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="slider-container w-screen relative mx-auto">
      {loading ? (
        <div className="loading-container">
          <SliderSkeleton />
        </div>
      ) : (
        <Slider {...settings} className="w-full">
          {sliderData.map(({ _id, property }) => (
            <div
              className="slider-item relative cursor-pointer"
              key={_id}
              onClick={() => handleViewProperty(property._id)}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              {/* Smaller Address Component */}
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-2 rounded-lg shadow-md w-36">
                <h3 className="text-sm font-semibold text-teal-600 truncate">
                  {property.title}
                </h3>
                <p className="text-xs text-gray-700 truncate">
                  {property.city}, {property.state}
                </p>
                <p className="text-xs font-bold text-teal-700">
                  ₹{property.monthlyRent}/month
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default PropertySlider;
