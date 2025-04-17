import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Customer from './Customer';
import Property from './Property';
import Facilities from './Facilities';
import Categories from './Categories';
import Slider from './Slider';
import { Navigate } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="flex-grow bg-f7f7f7 p-6 ml-64">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/property" element={<Property />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/slider" element={<Slider />} />
          {/* Redirect to /dashboard if no path matches */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
