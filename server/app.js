const express = require('express');
const app = express();

//For phase 4
//Pre req: npm install dotenv --save-dev
require('dotenv').config(); //Or hange in package.json instead
console.log("Variable MYTEST: " + process.env.MYTEST)


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

//Phase 4
app.use((err, req, res, next) => {
  console.log(err);
  res.statusCode = (err.statusCode || 500);
let body = {}
    if(process.env.NODE_ENV === "production"){
      console.log("MY ONW TEST TO CHECK IF ERROR")
      body = {
        message: (err.message || "something went wrong"),
        statusCode: res.statusCode
      }
    }else{
      body = {
      message: (err.message || "something went wrong"),
      statusCode: res.statusCode,
      stack: err.stack
      }
    }
  res.json(body)
});


const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
