const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const propertyRoutes = require("./routes/property.route");
const facilityRoutes = require("./routes/facility.route");
const categoryRoutes = require("./routes/category.route");
const sliderRoutes = require("./routes/slider.route");

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Working');
});
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/facilities", facilityRoutes);
app.use("/categories", categoryRoutes);
app.use("/slider", sliderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
