const express = require("express"); // importing express
const mongoose = require("mongoose"); // importing mongoose
const cors = require('cors'); // importing cors
const app = express(); // this indicates app is using express method to run 
const mongoURL = "mongodb+srv://dalcshub:summer23@main.avjsilz.mongodb.net/dalcshub?retryWrites=true&w=majority"

// connecting to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to mongoDB")
})
.catch((err) => {
    console.log("MongoDB connection failed", err)
});

const allowedOrigins = [
    'https://csci4177-dalcshub.netlify.app',
    'https://csci4177-dalcshub.onrender.com',
    'http://localhost:3000',
];
  
// Enable CORS for specific origins
app.use(cors({ origin: allowedOrigins }));

const userRoutes = require("./api/routes/user")
const courseRoutes = require("./api/routes/course")
const postRoutes = require("./api/routes/post")
const replyRoutes = require("./api/routes/reply")

app.use(express.json());

// Routes
app.use('/api/course', courseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/post', postRoutes);


app.use("/", (req, res) => {
    return res.status(404).json({
        message: "Route not found, okay",
        success: false
    })
});

// exporting the app to run on the server
module.exports = app;
