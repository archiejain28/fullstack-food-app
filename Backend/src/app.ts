import express from "express";
import passport from "passport";
import { createTables } from "./model/db.schema.ts";
import { seedData } from "./seed.ts";
import userRoute from "./routes/user.route.ts";
import restaurantRoute from "./routes/restaurant.route.ts";
import orderRoute from "./routes/order.route.ts";
import googleAuth from "./routes/google.route.ts";
import devAuth from "./routes/dev.route.ts";
import swaggerDocs from "./swagger.ts";

import "./passport.ts";

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3001";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(express.json());

app.use(passport.initialize());

swaggerDocs(app);

app.use("/auth/google", googleAuth);
app.use("/auth/dev", devAuth);
app.use("/users", userRoute);
app.use("/restaurant", restaurantRoute);
app.use("/orders", orderRoute);

(async () => {
  await createTables();
  await seedData();
  app.listen(port, () => {
    console.log(`server is up and running on ${port}`);
  });
})();
