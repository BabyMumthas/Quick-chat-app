import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        // Don't call connectSocket here if socket already exists
        if (!socket && data.user) {
          connectSocketInternal(data.user);
        }
      }
    } catch (error) {
      console.log("Not authenticated");
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  }, [socket]);

  // Login function
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Logout function
  const logout = async () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
  };

  // Update profile function
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
        return data.user;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Internal connect socket function
  const connectSocketInternal = useCallback(
    (userData) => {
      if (!userData || !userData._id) return;
      if (socket?.connected) return;

      console.log("Connecting socket for user:", userData._id);

      const newSocket = io(backendUrl, {
        query: { userId: userData._id },
      });

      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (usersId) => {
        setOnlineUsers(usersId);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    },
    [socket, backendUrl],
  );

  // Effect to connect socket when authUser changes
  useEffect(() => {
    if (authUser && !socket) {
      connectSocketInternal(authUser);
    }
  }, [authUser, socket, connectSocketInternal]);

  // Effect to check auth on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]); // Only run when token changes

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
