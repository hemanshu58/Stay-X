import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from "../../configs/config";

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Other fields + OTP
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${config.baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsLoading(false);
        setStep(2); // Move to the next step
      } else {
        const result = await response.json();
        setIsLoading(false);
        setError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form fields
    if (!name || !mobileNumber || !password || !otp) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const userData = {
      name,
      email,
      mobileNumber,
      password,
      otp,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${config.baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User registered successfully');
        setIsLoading(false);
        navigate('/login');
      } else {
        const result = await response.json();
        setIsLoading(false);
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded-lg shadow-lg shadow-gray-800/80">
      <h2 className="text-center mb-5 text-2xl font-bold">Register</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display spinner while loading */}
      {isLoading && (
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}

      <form onSubmit={step === 1 ? handleSendOtp : handleRegister}>
        {step === 1 && (
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
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
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
            <div className="mb-4">
              <label className="block mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        <button
          className="w-full p-2 bg-teal-600 text-white rounded-md hover:bg-teal-500"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (step === 1 ? 'Sending OTP...' : 'Registering...') : (step === 1 ? 'Send OTP' : 'Register')}
        </button>
      </form>

      {step === 1 && (
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-teal-600">Login here</Link>
        </p>
      )}
    </div>
  );
};

export default Register;
