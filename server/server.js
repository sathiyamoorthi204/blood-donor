const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// =============================
// SOCKET.IO CONFIG
// =============================
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  // expose socket.io on the /ws path to match client dev HMR path
  path: "/ws",
  transports: ["websocket", "polling"],
});

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());

// =============================
// DATABASE CONNECTION
// =============================
const connectToMongo = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected (MONGO_URI)");
      
      // Clean up old donor documents with old schema on startup
      try {
        const Donor = require("./models/Donor");
        const oldDonors = await Donor.countDocuments({ 
          $or: [
            { bloodGroup: { $exists: true } },
            { mobile: { $exists: true } },
            { city: { $exists: true } }
          ]
        });
        
        if (oldDonors > 0) {
          console.log(`🔄 Found ${oldDonors} donors with old schema, clearing...`);
          await Donor.deleteMany({ 
            $or: [
              { bloodGroup: { $exists: true } },
              { mobile: { $exists: true } },
              { city: { $exists: true } }
            ]
          });
          console.log("✅ Old donors cleared, ready for new data");
        }
      } catch (cleanupErr) {
        console.log("Info: Schema cleanup skipped");
      }
    } else {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("✅ Connected to In-Memory MongoDB");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectToMongo();

// =============================
// SOCKET CONNECTION HANDLING
// =============================
const connectedUsers = new Map();
const User = require("./models/User");

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("authenticate", async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user.id;

      const user = await User.findById(userId).select("role name");

      if (!user) return;

      connectedUsers.set(userId, {
        socketId: socket.id,
        role: user.role,
        name: user.name,
      });

      socket.userId = userId;
      socket.userRole = user.role;

      console.log(`✅ User authenticated: ${user.name} (${user.role})`);
    } catch (err) {
      console.log("❌ Socket authentication failed");
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log("❌ User disconnected:", socket.userId);
    }
  });
});

// Make socket accessible in routes
app.set("io", io);
app.set("connectedUsers", connectedUsers);

// =============================
// ROUTES
// =============================
app.get("/", (req, res) =>
  res.send("🩸 Blood Donor API running successfully")
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/donors", require("./routes/donors"));
app.use("/api/requests", require("./routes/requests"));

// Admin endpoint to clear old donors (for migration)
app.delete("/api/admin/clear-donors", async (req, res) => {
  try {
    const Donor = require("./models/Donor");
    await Donor.deleteMany({});
    res.json({ message: "All donors cleared successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to clear donors" });
  }
});

// =============================
// VERIFY EMAIL CONFIGURATION
// =============================
const { verifyTransporter } = require("./utils/mailer");
verifyTransporter().catch(err => console.error("Email verification error:", err.message));

// =============================
// ERROR HANDLER
// =============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// =============================
// START SERVER with graceful EADDRINUSE handling
// =============================
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Try to start the server on `port`. If it's already in use, try the next one (up to +10).
function startServer(port, attempts = 0) {
  const listenPromise = new Promise((resolve, reject) => {
    const listener = server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      resolve();
    });

    listener.once('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use.`);
        if (attempts < 10) {
          const nextPort = port + 1;
          console.log(`Attempting to start on port ${nextPort}...`);
          startServer(nextPort, attempts + 1).then(resolve).catch(reject);
        } else {
          console.error('Unable to bind to a port after multiple attempts. Please free the port or set PORT in your .env');
          reject(new Error('Port binding failed'));
        }
      } else {
        console.error('Server failed to start:', err);
        reject(err);
      }
    });
  });
  return listenPromise;
}

startServer(PORT).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
