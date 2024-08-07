import mysql from "mysql2";
export const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12666968",
  password: "JYZgQfzwBh",
  database: "sql12666968",
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database as id " + db.threadId);
});
db.on("error", (err) => {
  console.error("Database error: " + err.code);
});

// Close the database connection on application termination
process.on("SIGINT", () => {
  db.end((err) => {
    if (err) {
      console.error("Error closing the database connection: " + err.stack);
      process.exit(1);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});

export default db;
