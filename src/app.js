import express from "express";
import routes from "./routes.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/metrics", (req, res) => {
  res.type("text/plain").send("discountmate_requests_total 1\n");
});

// Very simple API-key gate for demo (only for /api routes)
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) return next();
  const key = req.header("x-api-key");
  if (!key || key !== "demo-key") return res.status(401).json({ error: "unauthorized" });
  next();
});

app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`DiscountMate API running on :${port}`));

export default app;
