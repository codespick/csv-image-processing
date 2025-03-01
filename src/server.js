const express = require("express");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(express.json());
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.send("App running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
