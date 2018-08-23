const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

// Configure body-parser for Angular and jQuery
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // This line is required for Angular

// import routes from router
const entriesRouter = require('./routes/entries.router.js');
const projectsRouter = require('./routes/projects.router.js');

// use routes in router given a base route
app.use('/entries', entriesRouter);
app.use('/projects', projectsRouter);

// Static files
app.use(express.static('server/public'));

// Start listening for requests on a specific port
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});