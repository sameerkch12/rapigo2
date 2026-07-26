const moment = require("moment-timezone");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const frontendLogModel = require("./models/frontend-log.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // ✅ FIX 1: JWT Authentication middleware for every socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.id;
      socket.data.userType = decoded.userType; // "user" or "captain"
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id} [${socket.data.userType}: ${socket.data.userId}]`);

    if (process.env.ENVIRONMENT == "production") {
      socket.on("log", async (log) => {
        log.formattedTimestamp = moment().tz("Asia/Kolkata").format("MMM DD hh:mm:ss A");
        try {
          await frontendLogModel.create(log);
        } catch (error) {
          console.log("Error sending logs...");
        }
      });
    }

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      // Only allow joining as your own authenticated userId
      if (userId?.toString() !== socket.data.userId?.toString() || userType !== socket.data.userType) {
        return socket.emit("error", { message: "Unauthorized: userId mismatch" });
      }

      console.log(userType + " joined: " + userId);
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.join(`user:${userId}`);
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.join(`captain:${userId}`);
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location, rideId } = data;

      // ✅ FIX 1 (cont): Only the authenticated captain can update their own location
      if (socket.data.userType !== "captain" || userId?.toString() !== socket.data.userId?.toString()) {
        return socket.emit("error", { message: "Unauthorized: Cannot update another captain's location" });
      }

      if (!location || location.ltd === undefined || location.lng === undefined) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          type: "Point",
          coordinates: [location.lng, location.ltd],
        },
      });

      if (rideId) {
        socket.to(rideId).emit("driver-location-updated", {
          rideId,
          latitude: location.ltd,
          longitude: location.lng,
          heading: location.heading || 0,
        });
      }
    });

    socket.on("join-room", (data) => {
      const roomId = typeof data === "object" ? data.roomId || data.rideId : data;
      if (roomId) {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
      }
    });

    socket.on("message", async ({ rideId, msg, userType, time }) => {
      const date = moment().tz("Asia/Kolkata").format("MMM DD");
      socket.to(rideId).emit("receiveMessage", { msg, by: userType, time });
      try {
        const ride = await rideModel.findOne({ _id: rideId });
        ride.messages.push({
          msg: msg,
          by: userType,
          time: time,
          date: date,
          timestamp: new Date(),
        });
        await ride.save();
      } catch (error) {
        console.log("Error saving message: ", error);
      }
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    console.log("message sent to: ", socketId);
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

const sendMessageToUserId = (userId, event, data) => {
  if (io) {
    console.log(`message sent to user room: user:${userId}`);
    io.to(`user:${userId}`).emit(event, data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

const sendMessageToCaptainId = (captainId, event, data) => {
  if (io) {
    console.log(`message sent to captain room: captain:${captainId}`);
    io.to(`captain:${captainId}`).emit(event, data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

const sendMessageToRoom = (roomId, event, data) => {
  if (io) {
    console.log(`message sent to room: ${roomId}`);
    io.to(roomId).emit(event, data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId, sendMessageToUserId, sendMessageToCaptainId, sendMessageToRoom };
