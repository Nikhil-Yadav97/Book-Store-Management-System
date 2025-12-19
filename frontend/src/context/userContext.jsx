import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

// Lightweight JWT payload decoder (avoids adding extra deps)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // atob is available in browser environments
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      setUser({
        id: decoded.id || decoded._id,
        name: decoded.name || decoded.username,
        email: decoded.email,
        role: decoded.role,
        store: decoded.storeId || null,
      });
    } catch (err) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
