import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({}); // {userId: count}

  const { sockets, axios } = useContext(AuthContext);

  //function to get all usersfor side bar

  const getUsers = async () => {
    try {
      const { data } = awaitaxios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };
  const value = {};

  return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
};
