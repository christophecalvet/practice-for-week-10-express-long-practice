const express = require('express');
const app = express();

//For phase 1
app.use(express.json());
require('express-async-errors');

const path = require('path');
app.use("/static",express.static(path.join(__dirname, '/assets')))


//Phase2 Logger Middleware
const logMiddleware = (req, res, next) => {
  console.log(req.method, req.url);
    res.on('finish', () => {
      console.log(res.statusCode);
    });
  next();
};
app.use(logMiddleware)



//PHHASE 3
const dogsRouter = require("./routes/dogs.js")
app.use("/dogs",dogsRouter)



// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

//Phase 2 resource not found
app.use((req, res, next)=>{
  const myError = new Error("The requested resource couldn't be found.")
  myError.statusCode = 404;
  throw myError;
})




const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
