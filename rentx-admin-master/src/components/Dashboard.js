import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import config from '../configs/config'; // Import the configuration file

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const baseUrl = config.baseUrl; // Use the base URL from the config file

  // Fetch user details, total properties, and total users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await fetch(`${baseUrl}/auth/currentuser`, {
          method: 'GET',
          credentials: 'include',
        });
        const userData = await userResponse.json();
        setUserName(userData.name);

        // Fetch total properties
        const propertiesResponse = await fetch(`${baseUrl}/properties/`, {
          method: 'GET',
          credentials: 'include',
        });
        const propertiesData = await propertiesResponse.json();
        setTotalProperties(propertiesData.length);

        // Fetch total users
        const usersResponse = await fetch(`${baseUrl}/users/`, {
          method: 'GET',
          credentials: 'include',
        });
        const usersData = await usersResponse.json();
        setTotalCustomers(usersData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [baseUrl]);

  return (
    <div className="p-1">
      {/* Greeting */}
      <div className="mb-1">
        <h1 className="text-3xl font-bold mb-2">Hi, {userName}</h1>
        <p className="text-gray-600">Welcome back! Here's your summary for RentX.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-teal-600">Total Customers</h2>
          <p className="text-4xl font-semibold mt-2">{totalCustomers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-teal-600">Total Properties</h2>
          <p className="text-4xl font-semibold mt-2">{totalProperties}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
