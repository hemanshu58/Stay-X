import React from "react";
import PropertySlider from "./PropertySlider";
import MostLiked from "./MostLiked";
import PropertySearchAndFilter from "./PropertySearchAndFilter";  // Import the new component
import "../styles.css";
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <div className="home-container">
      <Helmet>
          
          <title>BrokerFree-Stay : Dream House</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      {/* Property Slider Section */}
      <PropertySlider />

      {/* Property Search and Filter Section */}
      <PropertySearchAndFilter />

      {/* Most Liked Section */}
      <MostLiked />
    </div>
  );
};

export default Home;
