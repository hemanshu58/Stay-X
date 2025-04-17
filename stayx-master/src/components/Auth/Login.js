import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from "../../configs/config";
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const loginData = {
      email,
      password,
    };

    setIsLoading(true);

    try {
      // Send a POST request to the authentication API
      const response = await fetch(`${config.baseUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include', // To ensure cookies are included
      });
      
      // Check if the response is successful
      if (response.ok) {
        
        // Store JWT token in the browser's cookie (handled by server if HttpOnly)
        const isSecure = window.location.protocol === 'https:';
        document.cookie = `isLogged=true; path=/; ${isSecure ? 'secure;' : ''} SameSite=Strict`;

        console.log('Login successful');
        setIsLoading(false); 
        navigate('/');
        window.location.reload();
      } else {
        setIsLoading(false);

        if (response.status === 401 || response.status === 404) {
          setError('Invalid email or password. Please try again.');
        } else if (response.status === 500) {
          setError('Internal server error. Please try again later.');
        } else {
          setError(response.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded-lg shadow-lg shadow-gray-800/80">
      <Helmet>
          <title>StayX | Login</title> {/* Custom title */}
        <meta name="description" content="Find your dream rental home on StayX. Explore verified listings, compare properties, and make your move easy." />
      </Helmet>
      <h2 className="text-center mb-5 text-2xl font-bold">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {/* Display spinner while loading */}
      {isLoading && (
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          className="w-full p-2 bg-teal-600 text-white rounded-md hover:bg-teal-500"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center mt-4">
        New user? <Link to="/register" className="text-teal-600">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
