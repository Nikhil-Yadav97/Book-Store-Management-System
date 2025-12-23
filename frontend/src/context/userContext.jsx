import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

// Lightweight JWT payload decoder (avoids adding extra deps)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // encode base 64 string to utf-8
    // convt json to js object
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

    const fetchProfile = async () => {
      try {
        const decoded = decodeToken(token);
        if (!decoded) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        // Start with token-decoded values (fast), then try to fetch canonical user profile
        setUser({
          id: decoded.id || decoded._id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          store: decoded.storeId || null,
          balance: decoded.balance ?? 0,
          createdAt: decoded.createdAt || null,
        });

        // Fetch server profile to ensure we have fresh balance/createdAt
        // Import axios lazily to avoid circular imports if any
        const axios = (await import("../utlis/axiosinstance")).default;
        const res = await axios.get("/users/profile");
        if (res?.data?.user) {
          const u = res.data.user;
          setUser((prev) => ({
            ...prev,
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            store: u.store || null,
            balance: u.balance ?? 0,
            createdAt: u.createdAt || null,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err.message || err);
        // If token invalid or server returns 401, clear token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Listen for external balance updates (e.g., purchases)
    const handler = (e) => {
      const b = e?.detail?.balance;
      if (typeof b !== 'undefined') {
        setUser(prev => prev ? { ...prev, balance: b } : prev);
      }
    };
    window.addEventListener('userBalanceUpdated', handler);

    return () => window.removeEventListener('userBalanceUpdated', handler);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
