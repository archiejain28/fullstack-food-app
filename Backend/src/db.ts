import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost", // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: "food-app", // Name of database to connect to
  user: "postgres", // Username of database user
  password: "1234", // Password of database user
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => console.log(`database failed: ${err}`));
