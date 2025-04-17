import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PrivacyPolicy from "./components/static/PrivacyPolicy";
import TermsAndConditions from "./components/static/TermsAndConditions";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UploadProperty from "./components/UploadProperty";
import ShowProperty from "./components/ShowProperty";
import Profile from "./components/Profile";
import FavouriteProperties from "./components/FavouriteProperty";
import MyProperties from "./components/MyProperties";
import EditProperty from "./components/EditProperty";
import Footer from "./components/static/Footer";
import AboutUs from "./components/static/AboutUs";
import "./styles.css";
import { HelmetProvider } from 'react-helmet-async';
import { UserProvider } from "./contexts/UserContext";

// This component contains the logic for showing/hiding the Footer based on the route
const MainLayout = () => {
  const location = useLocation();

  // Define the paths where the footer SHOULD be displayed
  const showFooterPaths = [
    "/",
    "/terms-and-conditions",
    "/privacy-policy",
    "/about",
  ];

  // Check if the current path matches any of the showFooterPaths
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  return (
    <>
      <HelmetProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<ShowProperty />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/upload-property" element={<UploadProperty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favourites" element={<FavouriteProperties />} />
          <Route path="/myproperties" element={<MyProperties />} />
          <Route path="/edit/:id" element={<EditProperty />} />
        </Routes>
        {/* Conditionally render the Footer only on Home, Terms and Conditions, and Privacy Policy pages */}
        {shouldShowFooter && <Footer />}
      </HelmetProvider>
    </>
  );
};

// The main App component that initializes the Router
const App = () => {
  return (
    <Router>
      <UserProvider>
        <MainLayout />
      </UserProvider>
    </Router>
  );
};

export default App;
