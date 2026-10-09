const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// moduel imports
const { initDB } = require('./utils/dbhelper');

// initialize app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;

// initialize database
initDB();

// load views
app.set('view engine', 'ejs');
app.use(express.static('public'));

// import routes
const { submitLetter, 
  trackLetter, getLetter, setAppointmentRoute,
   forwardLetterToPA, acknowledgeLetterByPA, replytoLetter,
    forwardLetterToCeo, forwardedTopa, acknowlgedLetter, ceoLetter } = require('./routes/routes');

// use routes
app.use('/api', submitLetter);
app.use('/api', trackLetter);
app.use('/api', getLetter);
app.use('/api', forwardLetterToPA);
app.use('/api', acknowledgeLetterByPA);
app.use('/api', forwardLetterToCeo);
app.use('/api', replytoLetter);
app.use('/api', setAppointmentRoute);
app.use('/api', forwardedTopa);
app.use("/api", acknowlgedLetter);
app.use('api', ceoLetter)



// home route
app.get('/', (req, res) => {
  res.render('index', { title: 'Letter Tracker' });
});

// Clerk route
app.get("/clerk", (req, res) => {
  res.render("clerk", { title: "Clerk Letter Tracker" });
});

// PA route
app.get("/pa", (req, res) => {
  res.render("pa", { title: "PA Letter Tracker" });
});

// CEO route
app.get("/ceo", (req, res) => {
  res.render("ceo", { title: "CEO Letter Tracker" });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});