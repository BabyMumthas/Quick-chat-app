import Message from "../models/Message";

//get all users except the logged in user
export const getUserForSidebar = async (req, res) => {
    try {
        const userLd = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userLd } }).select("-password");

        //count of unread messages not seen

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userLd, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}