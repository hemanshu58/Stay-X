import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 py-12">

      <Helmet>
        <title>StayX | About Us</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome to StayX</h1>
          <p className="text-lg lg:text-xl font-light max-w-3xl mx-auto leading-relaxed">
            At StayX, we are transforming the rental experience by connecting renters with the right properties in a 
            transparent, secure, and convenient way.
          </p>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our mission is to simplify the rental process by offering a streamlined platform that provides renters with 
            complete property information, verified listings, and direct communication with property owners. We are 
            committed to transparency and innovation to build trust in the rental market.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Value 1 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in providing accurate, clear, and verified information for every listing, ensuring complete 
                transparency between renters and property owners.
              </p>
            </div>
            {/* Value 2 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                Leveraging technology to make the rental process efficient and easy is at the core of our platform. We 
                are constantly evolving to meet the needs of the modern renter.
              </p>
            </div>
            {/* Value 3 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Building a community of trustworthy landlords and renters is key to our mission. We encourage positive 
                interactions and long-term relationships.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-400 py-16 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to List or Rent a Property?</h2>
          <p className="text-lg font-light mb-8 max-w-3xl mx-auto">
            Whether you're looking to find a rental or list your property, StayX makes the process quick, easy, and 
            transparent. Join our community of satisfied renters and property owners today!
          </p>
          <a href="/" className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded text-white font-semibold">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
