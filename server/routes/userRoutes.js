import express from 'express';
import { checkAuth, Login, Signup, updateProfile } from '../controllers/userController';
import { protectRoute } from '../middleware/auth.js';


const userRoutes = express.Router();


userRoutes.post("/signUp", Signup)
userRoutes.post("/login", Login)
userRoutes.put("/update-profile", protectRoute, updateProfile)
userRoutes.get("/check", protectRoute, checkAuth);


export default userRoutes;

