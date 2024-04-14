 console.clear();
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const path = require('path');
const fileRouter = require('./Routes/FileRoute');
const fileMetaDataRouter = require('./Routes/FileMetaDataRoute');
app.use(cors());

const port = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static/images', express.static(path.join(__dirname, 'Assets/Base Directory')));
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => logger.http(message.trim()),
    },
  }
);
app.use(morgan("dev"));
app.use('/api', fileRouter);
app.use('/api', fileMetaDataRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});