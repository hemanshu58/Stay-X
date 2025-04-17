import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "../configs/config"; // Import base URL config

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // To handle error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      // Send a POST request to the authentication API
      const response = await fetch(`${config.baseUrl}/auth/signin-admin`, {
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
        // Set a custom `isLogged` cookie to indicate successful login without an expiration timer
        const isSecure = window.location.protocol === 'https:'; // Check if running over HTTPS
        document.cookie = `isLogged=true; path=/; ${isSecure ? 'secure;' : ''} SameSite=Strict`;
        
        console.log('Login successful');
        navigate('/dashboard'); // Redirect to the dashboard after login
      } else {
        const result = await response.json();
        setError(result.message || 'Login failed'); // Display error message from API
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.'); // Generic error message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded-lg shadow-lg shadow-gray-800/80">
      <h2 className="text-center mb-5 text-2xl font-bold">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
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
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
