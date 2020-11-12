const express = require("express");
const logger = require("morgan");
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose")

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/workout', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);
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

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'exercise.html'));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

/******************************* MiddleWare  ****************************/





//GET REQUESTS


app.get("/api/workouts", (req, res) => {
    db.find({}).sort({ day: -1 }).limit(1)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/api/workouts/range", (req, res) => {
    db.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});



//PUT REQUESTS

app.put("/api/workouts/:id", (req, res) => {

    let urlData = req.params;
    let data = req.body;
    db.updateOne({ _id: urlData.id }, {
            $push: {
                exercises: [{
                    "type": data.type,
                    "name": data.name,
                    "duration": data.duration,
                    "distance": data.distance,
                    "weight": data.weight,
                    "reps": data.reps,
                    "sets": data.sets
                }]
            }
        }).then(dbUpdate => {
            res.json(dbUpdate);
        })
        .catch(err => {
            res.json(err);
        });

});


//POST REQUESTS

app.post("/api/workouts", (req, res) => {

    let data = req.body;
    console.log(data)
    db.create({
            day: new Date().setDate(new Date().getDate())
        }).then(dbUpdate => {
            console.log("dbUpdate", dbUpdate)

            res.json(dbUpdate);
        })
        .catch(err => {
            console.log("error", err)
            res.json(err);

        });
});



/******************************* Connect to db  ****************************/


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});