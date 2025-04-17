import React, { createContext, useState, useEffect } from "react";
import config from "../configs/config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/auth/currentuser`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.status === 200) {
          const data = await response.json();
          setUser(data);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
