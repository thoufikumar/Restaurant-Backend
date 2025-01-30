const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/Users");
const Table=require("./models/Table")
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));

  app.post("/register", async (req, res) => {
    try {
      const { firstname, lastname, gender, email, password } = req.body;
      console.log(req.body  )
      if (!firstname || !lastname || !gender || !email || !password) {
        return res.status(400).json({ message: "All fields are required", isvalid: false });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists", isvalid: false });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ firstname, lastname, gender, email, password: hashedPassword });
      console.log(newUser)
     await newUser.save()
  
      res.status(201).json({ message: "SignUp Successful!", isvalid: true });
    } catch (error) {
      console.error("Register Error:", error); 
      res.status(500).json({ message: "Internal Server Error", isvalid: false, error: error.message });
    }
  });
  
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ email });
console.log("v f")
    if (!user) return res.status(404).json({ message: "User not found", isvalid: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password", isvalid: false });
console.log("jwt")
    // Generate JWT token
    const token = jwt.sign({ userId: user._id,name:user.firstname }, "abcdef", { expiresIn: "1h" });
console.log("kcfkbfbv")
    res.status(200).json({ message: "Login successful", token,isvalid: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", isvalid: false });
  }
});
app.post("/book-table", async (req, res) => {
  try {
    const { tableType, isBooked, bookingTime, userId, amount } = req.body;
console.log(req.body)
    // Check if the user exists before booking a table
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new table booking
    const newTableBooking = new Table({
      tableType,
      isBooked,
      bookingTime,
      user: userId, // Reference to the User model
      amount
    });

    // Save the new table booking to the database
    await newTableBooking.save();

    // Send success response
    res.status(201).json({
      message: "Table booked successfully!",
      tableBooking: newTableBooking
    });
  } catch (error) {
    console.error("Error booking table:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


app.listen(5004, () => console.log("Server started"));
