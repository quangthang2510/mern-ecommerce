const app = require("./app");
const dotenv = require("dotenv");
const connect = require("./db/database");

//Handling uncaught Exception:
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Handling Uncaught Exception");
  process.exit(1);
});
// config
dotenv.config({ path: "backend/config/config.env" });
//connecting database
connect();
const server = app.listen(process.env.PORT, () => {
  console.log(`App listening on PORT ${process.env.PORT}`);
});
// unhandled Promise Rejection
process.on("unhandleReject", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
