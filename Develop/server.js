const express = require("express");
const logger = require("morgan");
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose")

//Bring in models
const db = require("./Models/Workouts");
// Const Seed = require("./seed")
// Create an instance of the express app.
let app = express();
app.use(logger("dev"));

// Added so body parser can handle post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Host Static Files so css and js files can be retrieved
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// Routes
// Set the port of our application, process.env.PORT lets the port be set by Heroku
let PORT = process.env.PORT || 8081;


/******************************* Routes  ****************************/

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



/******************************* Connect to db  ****************************/


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});