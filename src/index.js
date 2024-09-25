import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import express from "express"; // Import express
import connectDB from "./db/index.js"; // Your database connection
import {app} from "./app.js";

dotenv.config({
  path: './env'
});


// const app = express(); // Create an Express app
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });


  

// Uncomment and use this block if needed
/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/
