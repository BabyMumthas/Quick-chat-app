import { createContext, useState, useContext } from "react"; // Missing useState and useContext imports
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({}); 

  const { socket, axios } = useContext(AuthContext); 

  // Function to get all users for side bar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users"); 
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }; 

  // Function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message); 
    }
  };

  const value = {
    
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}; 
