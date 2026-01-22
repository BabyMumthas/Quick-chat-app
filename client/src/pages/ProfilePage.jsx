import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Sync state when authUser loads
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) return;

    setLoading(true);

    try {
      // ✅ No image selected
      if (!selectedImg) {
        await updateProfile({
          fullName: name,
          bio,
        });

        toast.success("Profile updated");
        setLoading(false);
        navigate("/");
        return;
      }

      // ✅ Image selected - convert to base64
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          await updateProfile({
            profilePic: reader.result,
            fullName: name,
            bio,
          });

          toast.success("Profile updated");
          setLoading(false);
          navigate("/");
        } catch (err) {
          toast.error("Failed to update profile");
          setLoading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Image upload failed");
        setLoading(false);
      };

      reader.readAsDataURL(selectedImg);
    } catch (error) {
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  // ✅ Prevent render before auth loads
  if (!authUser) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>

          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser.profilePic || assets.avatar_icon
              }
              alt=""
              className="w-12 h-12 rounded-full"
            />
            Upload profile image
          </label>

          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            required
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <img
          src={assets.logo_icon}
          alt=""
          className="max-w-44 aspect-square rounded-full my-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
