import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import { Server } from "socket.io";
import messageRoutes from "./routes/messageRoutes.js";



//create express app and http server
const app = express();
const server = http.createServer(app);

//initialize socket io server
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

//store online users
export const userSocketMap = {}; //{userId: socketId}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("New client connected: ", userId);

    if (userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("Client disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

//middlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);


//connect to database

await connectDB();
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => console.log("Server is running on PORT:" + PORT)
    );
}

//export server for vercel

export default server;