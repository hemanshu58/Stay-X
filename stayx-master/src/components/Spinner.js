import React from 'react';

const SliderSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        width: 80px; /* Adjust size as needed */
        height: 80px; /* Adjust size as needed */
        border: 8px solid rgba(255, 255, 255, 0.2); /* Light gray border */
        border-top: 8px solid #3498db; /* Blue top border */
        border-radius: 50%;
        position: relative;
        animation: spin 1.2s linear infinite;
      }

      .loader::before {
        content: '';
        position: absolute;
        top: -15px;
        left: -15px;
        right: -15px;
        bottom: -15px;
        border: 8px solid rgba(255, 255, 255, 0.1); /* Light gray for inner shadow */
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

export default SliderSpinner;
