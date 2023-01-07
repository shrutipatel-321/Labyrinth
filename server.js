const express = require("express");
const app = express();
const mysql = require("./connection").con;
const port = 8000;
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Routing
app.use('/question',  require('./routes/currentQuestion'));
app.use('/team',  require('./routes/insertTeam'));
app.use('/answer',  require('./routes/submitAnswer'));
app.use('/leaderboard',  require('./routes/leaderboard'));



// Server Listen
app.listen(port, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("app is runnig on port : ", port);
    }
  });