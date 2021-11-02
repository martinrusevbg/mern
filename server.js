const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

global.__basedir = __dirname;

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

//TODO:Martin:development start
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });
//
// function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });
//
//     Role.create({
//         id: 2,
//         name: "moderator"
//     });
//
//     Role.create({
//         id: 3,
//         name: "admin"
//     });
// }
//TODO:Martin:development end

//TODO:Martin:production start
db.sequelize.sync();
//TODO:Martin:production end

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to martinrusevbg application." });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/file.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
