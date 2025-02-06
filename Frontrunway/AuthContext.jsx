import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("authData");
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      return {
        isAuthenticated: true,
        user: parsedAuth.user,
        token: parsedAuth.token,
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem("authData", JSON.stringify({
        user: auth.user,
        token: auth.token
      }));
      localStorage.setItem("token", auth.token);
    } else {
      localStorage.removeItem("authData");
      localStorage.removeItem("token");
    }
  }, [auth]);

  const login = (user, token) => {
    setAuth({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false, 
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

