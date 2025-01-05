import express from "express";
import cors from "cors";
import dataRoute from "./routes/data";
import uploadRoute from "./routes/upload";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/data", dataRoute);
app.use("/upload", uploadRoute);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
