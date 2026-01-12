//SignUp a new user

export const Signup = async () => {
    const { fullName, email, password, bio, profilePic } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "All fields are required" });
        }
const user =await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists" });
        }

    } catch (error) {

    }
}