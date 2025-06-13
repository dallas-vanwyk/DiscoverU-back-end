// npm
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

// Import routers
const authRouter = require("./controllers/auth");
const testJwtRouter = require("./controllers/test-jwt");
const usersRouter = require("./controllers/users");
const postsRouter = require("./controllers/posts.js");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
// --- Recommended Detailed CORS Configuration ---
const allowedOrigins = [
  'https://discoveru.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
const corsOptions = {
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          console.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
      };
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Explicitly allow methods including OPTIONS
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Allow common headers + Authorization
  credentials: true, // Allow credentials (cookies/auth headers)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Apply detailed CORS options

// app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Routes
app.use("/auth", authRouter);
app.use("/test-jwt", testJwtRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.get('/', (req, res) => {
  res.send('is this thing on'); // test messsage to make sure server is running etc
});

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('The express app is ready! Listening on port', PORT);
});
