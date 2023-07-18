import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import url from './utils/url';
import { setCookies } from './utils/functions/setCookies';
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoggedOut, setUserLoggedOut] = useState(true);

  const saveUser = (user) => {
    setUser(user);
  };

  const removeUser = () => {
    setUser(null);

  };

  const fetchUser = async () => {

    if (!userLoggedOut) {

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_LOCAL_SERVER_HTTP_ROOT_ENDPOINT}/api/v1/users/showMe`);
        saveUser(data.user);
      } catch (error) {
        removeUser();
      }
      setIsLoading(false);
  
    }

  };

  const logoutUser = async () => {

    try {

      await axios.delete(`${import.meta.env.VITE_LOCAL_SERVER_HTTP_ROOT_ENDPOINT}/api/v1/auth/logout`, setCookies());
      removeUser();
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        saveUser,
        user,
        setUserLoggedOut,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
