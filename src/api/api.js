// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://cicdtodotask.onrender.com/api"
// });

// export default api;


// src/api/api.js
// src/api/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://cicdtodotask.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;


import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cicdtodotaskvite.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/health", (req, res) => res.send("OK"));
app.use("/api/todos", todoRoutes);

export default app;
