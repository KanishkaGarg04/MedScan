require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const reportRoutes = require("./routes/reportRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("MedScan Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});